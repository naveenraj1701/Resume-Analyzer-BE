const jwt = require("jsonwebtoken")

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({ message: "Authorization token required" })
        }

        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.userId = decoded.userId

        next()
    } catch (err) {
        console.log("Error in authorizing the user", err)
        return res.status(401).send({message: "Invalid or expired token"})
    }
}

module.exports = authMiddleware