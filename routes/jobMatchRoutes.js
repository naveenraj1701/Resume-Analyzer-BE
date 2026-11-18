const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")
const { createJobMatch, getAllJobMatches, getSingleJobMatch, deleteJobMatch } = require("../controllers/jobMatchController")

const jobMatchRouter = express.Router()

jobMatchRouter.post("/create-match", authMiddleware, createJobMatch)

jobMatchRouter.get("/all-matches", authMiddleware, getAllJobMatches)

jobMatchRouter.get("/single-match/:matchId", authMiddleware, getSingleJobMatch)

jobMatchRouter.delete("/delete-match/:matchId", authMiddleware, deleteJobMatch)

module.exports = jobMatchRouter