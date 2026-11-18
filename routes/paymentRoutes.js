const express = require("express")
const paymentRouter = express.Router()

const {
    createOrder,
    verifyPayment,
    getPaymentStatus
} = require("../controllers/paymentContoller")

const authMiddleware = require("../middleware/authMiddleware")

paymentRouter.post("/create-order", authMiddleware, createOrder)
paymentRouter.post("/verify-payment", authMiddleware, verifyPayment)
paymentRouter.get("/payment-status", authMiddleware, getPaymentStatus)

module.exports = paymentRouter