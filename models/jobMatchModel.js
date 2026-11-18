const mongoose = require("mongoose")

const jobMatchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    matchScore: {
        type: Number,
        default: 0
    },
    scoreBreakdown: {
        skills: {
            type: Number,
            default: 0
        },
        experience: {
            type: Number,
            default: 0
        },
        education: {
            type: Number,
            default: 0
        },
        keywords: {
            type: Number,
            default: 0
        }
    },
    matchedSkills: {
        type: [String],
        default: []
    },
    missingSkills: {
        type: [String],
        default: []
    },
    experienceMatch: {
        type: String,
        default: ""
    },
    strengths: {
        type: [String],
        default: []
    },
    explanation: {
        type: String,
        default: ""
    },
    suggestions: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})

const JobMatch = mongoose.model("JobMatch", jobMatchSchema)

module.exports = JobMatch