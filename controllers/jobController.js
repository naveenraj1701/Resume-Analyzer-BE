
const Job = require("../models/jobModel")

const createJob = async (req, res) => {
    try {
        const { jobTitle, companyName, jobDescription, requiredSkills, location, jobType, applyEnabled, applyLink } = req.body

        if (!jobTitle || !companyName || !jobDescription)
            return res.status(400).send({ message: "Job title, company name and description are required" })

        const newJob = new Job({
            userId: req.userId,
            jobTitle,
            jobDescription,
            companyName,
            requiredSkills,
            location,
            jobType,
            applyEnabled: applyEnabled || false,
    applyLink: applyEnabled ? applyLink : ""
        })

        await newJob.save()

        return res.status(201).send({
            message: "Job saved successfully",
            job: newJob
        })
    } catch (err) {
        console.log("Error in creating the job", err)
        return res.status(500).send({ message: err.message })
    }
}

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 })

        return res.status(200).send({
            message: "Jobs fetched successfully",
            totalJobs: jobs.length,
            jobs
        })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const getSingleJob = async (req, res) => {
    try {
        const { jobId } = req.params

        const job = await Job.findById(jobId)

        if (!job)
            return res.status(404).send({ message: "Job not found" })

        return res.status(200).send({
            message: "Job fetched successfully",
            job
        })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const updateJob = async (req, res) => {
    try {
        const { jobId } = req.params

        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { $set: req.body },
            {
                new: true,
                runValidators: true
            }
        )

        if (!updatedJob)
            return res.status(404).send({ message: "Job not found" })

        return res.status(200).send({
            message: "Job updated successfully",
            job: updatedJob
        })
    } catch (err) {
        console.log("Error updating job", err)
        return res.status(500).send({ message: err.message })
    }
}

const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params

        const deletedJob = await Job.findByIdAndDelete(jobId)

        if (!deletedJob)
            return res.status(404).send({ message: "Job not found" })

        return res.status(200).send({
            message: "Job deleted successfully"
        })
    } catch (err) {
        console.log("Error deleting job", err)
        return res.status(500).send({ message: err.message })
    }
}

module.exports = {
    createJob,
    getAllJobs,
    getSingleJob,
    updateJob,
    deleteJob
}
