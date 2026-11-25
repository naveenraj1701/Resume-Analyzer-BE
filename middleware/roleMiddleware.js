const User = require("../models/userModel")


const roleMiddleware = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.userId)

            if (!user || !allowedRoles.includes(user.role))
                return res.status(403).send({ message: "Access denied. Insufficient permissions." })
            next()
        } catch (err) {
            console.log("Role Middleware Error:", err)
            return res.status(500).send({
                message: "Internal server error"
            })
        }
    }
}

module.exports = {roleMiddleware}