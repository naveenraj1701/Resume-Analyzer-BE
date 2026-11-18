const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    paymentId: {
        type: String,
        default: null
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "INR"
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed", "refunded"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        default: null
    },
    receipt: {
        type: String,
        required: true
    },
    signature: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

const Payment = mongoose.model("payment", paymentSchema)

module.exports = Payment