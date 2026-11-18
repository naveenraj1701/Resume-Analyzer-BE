
const Interview = require("../models/interviewModel")
const Resume = require("../models/resumeModel")
const Job = require("../models/jobModel")
const generateInterviewQuestions = require("../services/interviewService")

const createInterview = async (req, res) => {
    try {
        const { resumeId, jobId, interviewType } = req.body

        if (!resumeId || !jobId) {
            return res.send({ message: "Resume and job are required" })
        }

        const resume = await Resume.findOne({
            _id: resumeId,
            userId: req.userId
        })

        if (!resume) {
            return res.send({ message: "Resume not found" })
        }

        const job = await Job.findOne({
            _id: jobId,
            userId: req.userId
        })

        if (!job) {
            return res.send({ message: "Job not found" })
        }

        if (!resume.extractedText) {
            return res.send({ message: "Resume text is not available" })
        }

        const selectedType = interviewType || "Mixed"

        const validTypes = ["Technical", "HR", "Behavioral", "Mixed"]

        if (!validTypes.includes(selectedType)) {
            return res.send({ message: "Invalid interview type" })
        }

        const generatedData = await generateInterviewQuestions(
            resume.extractedText,
            job.jobDescription,
            job.requiredSkills || [],
            selectedType
        )

        if (!generatedData.questions || generatedData.questions.length === 0) {
            return res.send({ message: "Failed to generate interview questions" })
        }

        const interview = new Interview({
            userId: req.userId,
            resumeId,
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

module.exports = { createInterview }
