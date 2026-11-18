const mongoose = require("mongoose")

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    extractedText: {
        type: String,
        default: ""
    },
    skills: {
        type: [String],
        default: []
    },
    experience: {
        type: String,
        default: ""
    },
    score: {
        type: Number,
        default: 0
    },
    feedback: {
        type: String,
        default: ""
    }
},
    {
        timestamps: true
    })

const Resume = mongoose.model("Resume", resumeSchema)

module.exports = Resume