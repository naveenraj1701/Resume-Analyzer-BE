
const User = require("../models/userModel")
const Resume = require("../models/resumeModel")
const Job = require("../models/jobModel")
const Application = require("../models/applicationModel")
const cloudinary = require("../config/cloudinary")


const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalAdmins, totalPremiumUsers, totalJobs, totalResumes, totalApplications, averageScore, recentUsers, recentJobs] = await Promise.all([
            User.countDocuments({ role: "user" }),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ isPremium: true }),
            Job.countDocuments(),
            Resume.countDocuments(),
            Application.countDocuments(),
            Resume.aggregate([
                {
                    $group: {
                        _id: null,
                        average: { $avg: "$score" }
                    }
                }
            ]),
            User.find()
                .select("name email role isPremium createdAt")
                .sort({ createdAt: -1 })
                .limit(5),
            Job.find()
                .select("jobTitle companyName location jobType createdAt")
                .sort({ createdAt: -1 })
                .limit(5)
        ])

        return res.status(200).send({
            message: "Admin dashboard statistics fetched successfully",
            stats: {
                totalUsers,
                totalAdmins,
                totalPremiumUsers,
                totalJobs,
                totalResumes,
                totalApplications,
                averageResumeScore: Number((averageScore[0]?.average || 0).toFixed(2))
            },
            recentUsers,
            recentJobs
        })
    } catch (err) {
        console.log("Admin Dashboard Error:", err)
        return res.status(500).send({ message: err.message })
    }
}


const getAllUsers = async (req, res) => {
    try {
        const {
            search = "",
            role = "all",
            page = 1,
            limit = 10
        } = req.query

        const filter = {}

        if (role !== "all") {
            filter.role = role
        }

        if (search.trim()) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        }

        const skip = (Number(page) - 1) * Number(limit)

        const [users, totalUsers] = await Promise.all([
            User.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            User.countDocuments(filter)
        ])

        return res.status(200).send({
            message: "Users fetched successfully",
            users,
            pagination: {
                totalUsers,
                currentPage: Number(page),
                totalPages: Math.ceil(totalUsers / Number(limit)),
                limit: Number(limit)
            }
        })
    } catch (err) {
        console.log("Get All Users Error:", err)
        return res.status(500).send({ message: err.message })
    }
}


const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params
        const { role } = req.body

        if (!["user", "admin"].includes(role)) {
            return res.send({ message: "Invalid role" })
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        )

        if (!user) {
            return res.send({ message: "User not found" })
        }

        return res.send({
            message: "User role updated successfully",
            user
        })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params

        if (userId === req.userId) {
            return res.send({ message: "You cannot delete your own account" })
        }

        const user = await User.findByIdAndDelete(userId)

        if (!user) {
            return res.send({ message: "User not found" })
        }

        return res.send({
            message: "User deleted successfully"
        })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


const getAllJobs = async (req, res) => {
    try {
        const {
            search = "",
            page = 1,
            limit = 10
        } = req.query

        const filter = {}

        if (search.trim()) {
            filter.$or = [
                { jobTitle: { $regex: search, $options: "i" } },
                { companyName: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } }
            ]
        }

        const skip = (Number(page) - 1) * Number(limit)

        const [jobs, totalJobs] = await Promise.all([
            Job.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Job.countDocuments(filter)
        ])

        return res.status(200).send({
            message: "Jobs fetched successfully",
            jobs,
            pagination: {
                totalJobs,
                currentPage: Number(page),
                totalPages: Math.ceil(totalJobs / Number(limit)),
                limit: Number(limit)
            }
        })
    } catch (err) {
        console.log("Get All Jobs Error:", err)
        return res.status(500).send({ message: err.message })
    }
}

const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params

        const job = await Job.findByIdAndDelete(jobId)

        if (!job) {
            return res.send({ message: "Job not found" })
        }

        return res.send({
            message: "Job deleted successfully"
        })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const getAllResumes = async (req, res) => {
    try {
        const {
            search = "",
            page = 1,
            limit = 10
        } = req.query

        const filter = {}

        if (search.trim()) {
            filter.$or = [
                { fileName: { $regex: search, $options: "i" } }
            ]
        }

        const skip = (Number(page) - 1) * Number(limit)

        const [resumes, totalResumes] = await Promise.all([
            Resume.find(filter)
                .populate("userId", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Resume.countDocuments(filter)
        ])

        return res.send({
            message: "Resumes fetched successfully",
            resumes,
            pagination: {
                totalResumes,
                currentPage: Number(page),
                totalPages: Math.ceil(totalResumes / Number(limit)),
                limit: Number(limit)
            }
        })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const deleteResume = async (req, res) => {
    try {
        const { resumeId } = req.params

        const resume = await Resume.findById(resumeId)

        if (!resume) {
            return res.send({ message: "Resume not found" })
        }

        await cloudinary.uploader.destroy(resume.publicId, {
            resource_type: "raw"
        })

        await Resume.findByIdAndDelete(resumeId)

        return res.send({
            message: "Resume and Cloudinary file deleted successfully"
        })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const getAllApplications = async (req, res) => {
    try {
        const {
            search = "",
            page = 1,
            limit = 10
        } = req.query

        const filter = {}

        if (search.trim()) {
            filter.status = { $regex: search, $options: "i" }
        }

        const skip = (Number(page) - 1) * Number(limit)

        const [applications, totalApplications] = await Promise.all([
            Application.find(filter)
                .populate("userId", "name email")
                .populate("jobId", "jobTitle companyName")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Application.countDocuments(filter)
        ])

        return res.send({
            message: "Applications fetched successfully",
            applications,
            pagination: {
                totalApplications,
                currentPage: Number(page),
                totalPages: Math.ceil(totalApplications / Number(limit)),
                limit: Number(limit)
            }
        })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const deleteApplication = async (req, res) => {
    try {
        const { applicationId } = req.params

        const application = await Application.findByIdAndDelete(applicationId)

        if (!application) {
            return res.send({ message: "Application not found" })
        }

        return res.send({
            message: "Application deleted successfully"
        })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


module.exports = {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllJobs,
    deleteJob,
    getAllResumes,
    deleteResume,
    getAllApplications,
    deleteApplication
}
