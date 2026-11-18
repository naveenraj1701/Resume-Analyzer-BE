
const Application = require("../models/applicationModel")
const Job = require("../models/jobModel")
const Resume = require("../models/resumeModel")

const createApplication = async (req, res) => {
    try {
        const { jobId, resumeId, status, notes } = req.body

        if (!jobId || !resumeId) {
            return res.send({
                success: false,
                message: "Job and Resume are required"
            })
        }

        const job = await Job.findOne({
            _id: jobId,
            userId: req.userId
        })

        const resume = await Resume.findOne({
            _id: resumeId,
            userId: req.userId
        })

        if (!job || !resume) {
            return res.send({
                success: false,
                message: "Job or Resume not found"
            })
        }

        const existingApplication = await Application.findOne({
            userId: req.userId,
            jobId
        })

        if (existingApplication) {
            return res.send({
                success: false,
                message: "Application already exists for this job"
            })
        }

        const newApplication = new Application({
            userId: req.userId,
            jobId,
            resumeId,
            status: status || "Saved",
            appliedDate: status === "Applied" ? new Date() : null,
            notes: notes || ""
        })

        await newApplication.save()

        res.send({
            success: true,
            message: "Application created successfully",
            application: newApplication
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
}

const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            userId: req.userId
        })
            .populate("jobId")
            .populate("resumeId", "fileName")
            .sort({ createdAt: -1 })

        res.send({
            success: true,
            applications
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
}

const updateApplication = async (req, res) => {
    try {
        const { status, notes } = req.body

        const allowedStatuses = [
            "Saved",
            "Applied",
            "Interview",
            "Offer",
            "Rejected"
        ]

        if (status && !allowedStatuses.includes(status)) {
            return res.send({
                success: false,
                message: "Invalid application status"
            })
        }

        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.userId
        })

        if (!application) {
            return res.send({
                success: false,
                message: "Application not found"
            })
        }

        if (status) {
            application.status = status

            if (status === "Applied" && !application.appliedDate) {
                application.appliedDate = new Date()
            }
        }

        if (notes !== undefined) {
            application.notes = notes
        }

        await application.save()

        res.send({
            success: true,
            message: "Application updated successfully",
            application
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
}

const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        })

        if (!application) {
            return res.send({
                success: false,
                message: "Application not found"
            })
        }

        res.send({
            success: true,
            message: "Application deleted successfully"
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    createApplication,
    getAllApplications,
    updateApplication,
    deleteApplication
}
