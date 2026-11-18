const Razorpay = require("razorpay")
require("dotenv").config()

const razorpay = new Razorpay({
    key_id: process.env.RazorPay_Key_ID,
    key_secret: process.env.RazorPay_Key_SECRET
})

module.exports = razorpay