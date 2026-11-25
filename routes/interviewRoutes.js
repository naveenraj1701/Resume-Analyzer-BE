
const express = require("express")
const { createInterview, evaluateAnswer } = require("../controllers/interviewController")
const authMiddleware = require("../middleware/authMiddleware")

const interviewRouter = express.Router()

interviewRouter.post("/create", authMiddleware, createInterview)

interviewRouter.post("/evaluate-answer", authMiddleware, evaluateAnswer)

module.exports = interviewRouter
