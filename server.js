const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const jobRouter = require("./routes/jobRoutes")
const userRouter = require("./routes/userRoutes")
const jobMatchRouter = require("./routes/jobMatchRoutes")
const resumeRouter = require("./routes/resumeRoutes")
const paymentRouter = require("./routes/paymentRoutes")
const jobUrlRouter = require("./routes/jobUrlRoutes")
const applicationRouter = require("./routes/applicationRoutes")
const interviewRouter = require("./routes/interviewRoutes")


//Instance

const app = express()
const port = process.env.PORT || 5000


app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://ai-resume-analyzer-fe.vercel.app"
    ],
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/user", userRouter)
app.use("/api/resume", resumeRouter)
app.use("/api/job", jobRouter)
app.use("/api/job-match", jobMatchRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/job-url", jobUrlRouter)
app.use("/api/application", applicationRouter)
app.use("/api/interview", interviewRouter)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.log("Error in connecting to MongoDB", err))




app.listen(port, () => {
    console.log("Server is running on", port);

})