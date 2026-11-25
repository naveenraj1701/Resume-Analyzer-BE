const express = require("express")
const resumeRouter = express.Router()

const authMiddleware = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware")

const {
    uploadResume,
    replaceResume,
    extractResumeText,
    analyzeResume,
    getAllResumes
} = require("../controllers/resumeController")

resumeRouter.post("/upload", authMiddleware, upload.single("resume"), uploadResume)

resumeRouter.post("/replace", authMiddleware, upload.single("resume"), replaceResume)

resumeRouter.post("/extract/:resumeId", authMiddleware, extractResumeText)

resumeRouter.post("/analyze/:resumeId", authMiddleware, analyzeResume)

resumeRouter.get("/all-resumes", authMiddleware, getAllResumes)

module.exports = resumeRouter