const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")


const {
    createJob,
    getAllJobs,
    getSingleJob,
    updateJob,
    deleteJob
} = require("../controllers/jobController")
const { roleMiddleware } = require("../middleware/roleMiddleware")

const jobRouter = express.Router()

jobRouter.post("/create-job", authMiddleware, roleMiddleware("admin"), createJob)

jobRouter.get("/all-jobs", authMiddleware, roleMiddleware("admin", "user"), getAllJobs)

jobRouter.get("/single-job/:jobId", authMiddleware, roleMiddleware("admin", "user"), getSingleJob)

jobRouter.put("/update-job/:jobId", authMiddleware, roleMiddleware("admin"), updateJob)

jobRouter.delete("/delete-job/:jobId", authMiddleware, roleMiddleware("admin"), deleteJob)

module.exports = jobRouter