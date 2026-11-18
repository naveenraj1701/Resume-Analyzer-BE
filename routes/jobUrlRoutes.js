const express = require("express")
const { extractJobFromURL } = require("../controllers/jobUrlController")

const jobUrlRouter = express.Router()

jobUrlRouter.post("/extract-job", extractJobFromURL)

module.exports = jobUrlRouter