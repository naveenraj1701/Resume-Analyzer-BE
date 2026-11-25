const crypto = require("crypto")
const razorpay = require("../config/razorPay")
const Razorpay = require("razorpay")
const Payment = require("../models/paymentModel")
const User = require("../models/userModel")

const createOrder = async (req, res) => {
    try {
        const { planId } = req.body

        const plans = {
            "premium-job-match": {
                name: "AI Job matching premium",
                amount: 50000
            }
        }

        const selectedPlan = plans[planId]

        if (!selectedPlan)
            return res.status(404).send({ message: "Invalid Plan ID" })
        const receipt = `Receipt_${Date.now()}`

        const options = {
            amount: selectedPlan.amount,
            currency: "INR",
            receipt
        }

        const order = await razorpay.orders.create(options)

        const newPayment = new Payment({
            userId: req.userId,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt,
            status: "pending"
        })

        await newPayment.save()

        return res.status(201).send({
            message: "Razorpay order created successfully",
            data: {
                order_id: order.id,
                amount: order.amount,
                currency: order.currency,
                key_id: process.env.RazorPay_Key_ID
            }
        })

    } catch (err) {
        console.log("Error in creating the payment order", err)
        return res.status(500).send({ message: err.message })
    }
}

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
            return res.status(400).send({ message: "Payment verification details are required" })

        const payment = await Payment.findOne({
            orderId: razorpay_order_id,
            userId: req.userId
        })

        if (!payment)
            return res.status(404).send({ message: "Payment order not found" })

        if (payment.status === "success") {
            await User.findByIdAndUpdate(req.userId, {
                isPremium: true
            })

            return res.status(200).send({
                message: "Payment already verified",
                isPremium: true
            })
        }

        const generatedSignature = crypto.createHmac(
            "sha256",
            process.env.RazorPay_Key_SECRET
        ).update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex")

        const generatedBuffer = Buffer.from(generatedSignature, "hex")
        const receivedBuffer = Buffer.from(razorpay_signature, "hex")

        if (
            generatedBuffer.length !== receivedBuffer.length ||
            !crypto.timingSafeEqual(generatedBuffer, receivedBuffer)
        )
            return res.status(400).send({ message: "Invalid payment signature" })

        const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id)

        if (razorpayPayment.order_id !== razorpay_order_id)
            return res.status(400).send({ message: "Payment order mismatch" })

        if (razorpayPayment.status !== "captured")
            return res.status(400).send({ message: "Payment is not captured yet" })

        if (
            razorpayPayment.amount !== payment.amount ||
            razorpayPayment.currency !== payment.currency
        )
            return res.status(400).send({ message: "Payment amount or currency mismatch" })

        await User.findByIdAndUpdate(req.userId, {
            isPremium: true
        })

        payment.paymentId = razorpay_payment_id
        payment.signature = razorpay_signature
        payment.status = "success"

        await payment.save()

        return res.status(200).send({
            message: "Payment verified successfully",
            isPremium: true
        })

    } catch (err) {
        console.error("Verify Payment Error:", err)

        return res.status(500).send({
            success: false,
            message: "Payment verification failed"
        })
    }
}

const getPaymentStatus = async (req, res) => {
    try {
        const payment = await Payment.findOne({
            userId: req.userId,
            status: "success"
        })

        return res.status(200).send({
            paid: !!payment,
            message: payment ? "Payment completed" : "Payment required"
        })

    } catch (err) {
        return res.status(500).send({
            message: err.message
        })
    }
}

module.exports = { createOrder, verifyPayment, getPaymentStatus }