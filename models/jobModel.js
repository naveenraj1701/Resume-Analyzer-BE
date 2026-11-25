const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    companyName: {
         type: String,
        required: true
    },
    jobDescription: {
         type: String,
        required: true
    },
    requiredSkills: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        default: ""
    },
    jobType: {
        type: String,
        default: "Full-Time"
    },
    applyEnabled: {
        type: Boolean,
        default: false
    },
    applyLink: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

const Job = mongoose.model("Job", jobSchema)

module.exports = Job