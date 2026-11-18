const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


//Register user using name, email, password

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password)
            return res.status(400).send({ message: "All fields are required" })

        const existingUser = await User.findOne({ email: email })

        if (existingUser)
            return res.status(409).send({ message: "Email already registered" })

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save()

        return res.status(201).send({ message: "User registered successfully" })
    }
    catch (err) {
        console.log("Error in register user", err)
        return res.status(500).send({ message: err.message })
    }
}


//Login user using email and password

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password)
            return res.status(400).send({ message: "Email and password are required" })

        const existingUser = await User.findOne({ email: email })

        if (!existingUser)
            return res.status(404).send({ message: "User not found" })

        const passwordMatch = await bcrypt.compare(password, existingUser.password)

        if (!passwordMatch)
            return res.status(401).send({ message: "Invalid password" })

        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

        return res.status(200).send({
            message: "Login successfull",
            token,
            user: {
                id: existingUser._id,
                email: existingUser.email,
                name: existingUser.name
            }
        })

    } catch (err) {
        console.log("Error in login user", err)
        return res.status(500).send({ message: err.message })

    }
}

module.exports = { registerUser, loginUser }