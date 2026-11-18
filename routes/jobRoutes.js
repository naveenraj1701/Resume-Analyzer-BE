const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")
const { createJob, getAllJobs, getSingleJob, updateJob, deleteJob } = require("../controllers/jobController")

const jobRouter = express.Router()

jobRouter.post("/create-job", authMiddleware, createJob)

jobRouter.get("/all-jobs", authMiddleware, getAllJobs)

jobRouter.get("/single-job/:jobId",authMiddleware, getSingleJob )

jobRouter.put("/update-job/:jobId", authMiddleware, updateJob)

jobRouter.delete("/delete-job/:jobId", authMiddleware, deleteJob)

module.exports = jobRouter