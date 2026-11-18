
const express = require("express")
const { createInterview } = require("../controllers/interviewController")
const authMiddleware = require("../middleware/authMiddleware")

const interviewRouter = express.Router()

interviewRouter.post("/create", authMiddleware, createInterview)

module.exports = interviewRouter
