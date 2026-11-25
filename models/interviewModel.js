const mongoose = require("mongoose")

const interviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    interviewType: {
        type: String,
        enum: ["Technical", "HR", "Behavioral", "Mixed"],
        default: "Mixed"
    },
    questions: [{
        question: String,
        category: String,
        sampleAnswer: String,
        userAnswer: {
            type: String,
            default: ""
        },
        feedback: {
            type: String,
            default: ""
        },
        score: {
            type: Number,
            default: 0
        }
    }]
}, { timestamps: true })

const Interview = mongoose.model("Interview", interviewSchema)

module.exports = Interview