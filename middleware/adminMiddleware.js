const User = require("../models/userModel")

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.send({ message: "User not found" })
        }

        if (user.role !== "admin") {
            return res.send({ message: "Access denied. Admin only." })
        }

        next()
    } catch (error) {
        res.send({ message: "Admin authorization failed", error: error.message })
    }
}

module.exports = adminMiddleware