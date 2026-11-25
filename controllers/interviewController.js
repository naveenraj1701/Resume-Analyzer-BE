
const Interview = require("../models/interviewModel")
const Job = require("../models/jobModel")
const { generateInterviewQuestions, evaluateInterviewAnswer } = require("../services/interviewService")

const createInterview = async (req, res) => {
    try {
        const { jobId, skills, interviewType } = req.body

        if (!jobId || !skills || !skills.length) {
            return res.send({ message: "Job and selected skills are required" })
        }

        if (!Array.isArray(skills)) {
            return res.send({ message: "Skills must be an array" })
        }

        const job = await Job.findById(jobId)

        if (!job) {
            return res.send({ message: "Job not found" })
        }

        const jobSkills = job.requiredSkills || []

        const selectedSkills = skills.filter(skill =>
            jobSkills.includes(skill)
        )

        if (!selectedSkills.length) {
            return res.send({ message: "Please select valid skills for this job" })
        }

        const selectedType = interviewType || "Mixed"

        const validTypes = ["Technical", "HR", "Behavioral", "Mixed"]

        if (!validTypes.includes(selectedType)) {
            return res.send({ message: "Invalid interview type" })
        }

        const generatedData = await generateInterviewQuestions(
            job.jobTitle,
            selectedSkills,
            selectedType
        )

        if (!generatedData.questions || generatedData.questions.length === 0) {
            return res.send({ message: "Failed to generate interview questions" })
        }

        const interview = new Interview({
            userId: req.userId,
            jobId,
            interviewType: selectedType,
            questions: generatedData.questions
        })

        await interview.save()

        res.send({
            message: "Interview questions generated successfully",
            interview
        })

    } catch (error) {
        console.log(error)
        res.send({ message: "Error generating interview questions" })
    }
}


const evaluateAnswer = async (req, res) => {
    try {
        const { interviewId, questionIndex, userAnswer } = req.body

        if (!interviewId || questionIndex === undefined) {
            return res.send({ message: "Interview ID and question index are required" })
        }

        const interview = await Interview.findOne({
            _id: interviewId,
            userId: req.userId
        })

        if (!interview) {
            return res.send({ message: "Interview not found" })
        }

        const question = interview.questions[questionIndex]

        if (!question) {
            return res.send({ message: "Question not found" })
        }

        const answer = userAnswer || ""

        const evaluation = await evaluateInterviewAnswer(
            question.question,
            answer,
            question.sampleAnswer,
            question.category
        )

        question.userAnswer = answer
        question.feedback = evaluation.feedback
        question.score = Math.max(0, Math.min(100, Number(evaluation.score) || 0))

        await interview.save()

        res.send({
            message: "Answer evaluated successfully",
            score: question.score,
            feedback: question.feedback,
            suggestions: evaluation.suggestions || []
        })

    } catch (error) {
        console.log(error)
        res.send({ message: "Error evaluating interview answer" })
    }
}


module.exports = { createInterview, evaluateAnswer }
