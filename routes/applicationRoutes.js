
const express = require("express")
const {
    createApplication,
    getAllApplications,
    updateApplication,
    deleteApplication
} = require("../controllers/applicationController")

const authMiddleware = require("../middleware/authMiddleware")

const applicationRouter = express.Router()

applicationRouter.post("/create", authMiddleware, createApplication)
applicationRouter.get("/all", authMiddleware, getAllApplications)
applicationRouter.put("/update/:id", authMiddleware, updateApplication)
applicationRouter.delete("/delete/:id", authMiddleware, deleteApplication)

module.exports = applicationRouter
