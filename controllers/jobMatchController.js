const Resume = require("../models/resumeModel")
const Job = require("../models/jobModel")
const JobMatch = require("../models/jobMatchModel")
const matchResumeWithJob = require("../services/jobMatchService")

const createJobMatch = async (req, res) => {
    try {
        const { resumeId, jobId } = req.body

        if (!resumeId || !jobId)
            return res.status(400).send({ message: "Resume ID and Job ID are required" })

        const resume = await Resume.findOne({
            _id: resumeId,
            userId: req.userId
        })

        if (!resume)
            return res.status(404).send({ message: "Resume not found" })

        if (!resume.extractedText)
            return res.status(400).send({ message: "Please extract the resume text first" })

        const job = await Job.findOne({
            _id: jobId,
            userId: req.userId
        })

        if (!job)
            return res.status(404).send({ message: "Job not found" })

        const analysis = await matchResumeWithJob(
            resume.extractedText,
            job.jobDescription,
            job.requiredSkills
        )

        const newMatch = new JobMatch({
            userId: req.userId,
            resumeId,
            jobId,
            matchScore: analysis.matchScore,
            scoreBreakdown: analysis.scoreBreakdown,
            matchedSkills: analysis.matchedSkills,
            missingSkills: analysis.missingSkills,
            experienceMatch: analysis.experienceMatch,
            strengths: analysis.strengths,
            explanation: analysis.explanation,
            suggestions: analysis.suggestions
        })

        await newMatch.save()

        return res.status(201).send({
            message: "Job Matching completed successfully",
            match: newMatch
        })

    } catch (err) {
        console.log("Error creating job match", err)
        return res.status(500).send({ message: err.message })
    }
}

const getAllJobMatches = async (req, res) => {
    try {
        const matches = await JobMatch.find({
            userId: req.userId
        })
            .populate("resumeId", "fileName score")
            .populate("jobId", "jobTitle companyName")
            .sort({ createdAt: -1 })

        return res.status(200).send({
            message: "Job matches fetched successfully",
            matches
        })

    } catch (err) {
        console.log("Error fetching job match results", err)
        return res.status(500).send({ message: err.message })
    }
}

const getSingleJobMatch = async (req, res) => {
    try {
        const { matchId } = req.params

        const match = await JobMatch.findOne({
            _id: matchId,
            userId: req.userId
        })
            .populate("resumeId", "fileName score skills experience")
            .populate("jobId", "jobTitle companyName jobDescription requiredSkills")

        if (!match) {
            return res.status(404).send({
                message: "Job match not found"
            })
        }

        return res.status(200).send({
            message: "Job match fetched successfully",
            match
        })

    } catch (err) {
        console.log("Error fetching single job match", err)
        return res.status(500).send({
            message: err.message
        })
    }
}

const deleteJobMatch = async (req, res) => {
    try {
        const { matchId } = req.params

        const deletedMatch = await JobMatch.findOneAndDelete({
            _id: matchId,
            userId: req.userId
        })

        if (!deletedMatch) {
            return res.status(404).send({
                message: "Job match not found"
            })
        }

        return res.status(200).send({
            message: "Job match deleted successfully"
        })

    } catch (err) {
        console.log("Error deleting job match", err)
        return res.status(500).send({
            message: err.message
        })
    }
}

module.exports = {
    createJobMatch,
    getAllJobMatches,
    getSingleJobMatch,
    deleteJobMatch
}