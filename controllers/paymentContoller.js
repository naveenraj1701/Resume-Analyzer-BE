const crypto = require("crypto")
const razorpay = require("../config/razorPay")
const Razorpay = require("razorpay")
const Payment = require("../models/paymentModel")

const createOrder = async (req, res) => {
    try {
        const { amount } = req.body

        if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0)
            return res.status(400).send({ message: "Valid amount is required" })

        const amountInPaisa = Math.round(Number(amount) * 100)
        const receipt = `Receipt_${Date.now()}`

        const options = {
            amount: amountInPaisa,
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
            return res.status(404).send({message: "Payment order not found"})

        if (payment.status === "success")
            return res.status(200).send({message: "Payment already verified"})

        const generatedSignature = crypto.createHmac(
            "sha256",
            process.env.RazorPay_Key_SECRET
        ).update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex")
          console.log("Signature :", generatedSignature, "razorpay :", razorpay_signature)

        if (generatedSignature !== razorpay_signature)
            return res.status(400).send({ message: "Invalid payment signature" })
        
        payment.paymentId = razorpay_payment_id
        payment.signature = razorpay_signature
        payment.status = "success"

        await payment.save()

        return res.status(200).send({message: "Payment verified successfully"})

    } catch (err) {
         console.error("Verify Payment Error:", err);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
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

module.exports = {createOrder, verifyPayment, getPaymentStatus}