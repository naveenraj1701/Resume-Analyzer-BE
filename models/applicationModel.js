const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema({
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
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
        required: true
    },
    status: {
        type: String,
        enum : ["Saved", "Applied", "Interview", "Offer", "Rejected"],
        default: "Saved"
    },
    appliedDate: {
        type: Date,
        default: null
    },
    notes: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

const Application = mongoose.model("Application", applicationSchema)

module.exports = Application