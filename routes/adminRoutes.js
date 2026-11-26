const express = require("express")
const adminRouter = express.Router()

const authMiddleware = require("../middleware/authMiddleware")
const { roleMiddleware } = require("../middleware/roleMiddleware")

const { getDashboardStats, getAllUsers, updateUserRole, deleteUser, getAllJobs, deleteJob, getAllResumes, deleteResume, getAllApplications, deleteApplication } = require("../controllers/adminController")
const adminMiddleware = require("../middleware/adminMiddleware")

adminRouter.get(
    "/dashboard-stats",
    authMiddleware,
    roleMiddleware("admin"),
    getDashboardStats
)

adminRouter.get(
    "/users",
    authMiddleware,
    roleMiddleware("admin"),
    getAllUsers
)

adminRouter.put("/update-user-role/:userId", authMiddleware, adminMiddleware, updateUserRole)

adminRouter.delete("/delete-user/:userId", authMiddleware, adminMiddleware, deleteUser)

adminRouter.get("/all-jobs", authMiddleware, adminMiddleware, getAllJobs)

adminRouter.delete("/delete-job/:jobId", authMiddleware, adminMiddleware, deleteJob)

adminRouter.get("/all-resumes", authMiddleware, adminMiddleware, getAllResumes)

adminRouter.delete("/delete-resume/:resumeId", authMiddleware, adminMiddleware, deleteResume)

adminRouter.get("/all-applications", authMiddleware, adminMiddleware, getAllApplications)

adminRouter.delete("/delete-application/:applicationId", authMiddleware, adminMiddleware, deleteApplication)


module.exports = adminRouter