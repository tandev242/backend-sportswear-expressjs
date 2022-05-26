const User = require("../models/user")
const Otp = require("../models/otp")
const bcrypt = require("bcrypt")
const { sendOtp } = require("../services/mailer")
const { OAuth2Client } = require("google-auth-library")
const client_id = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(client_id)
const {
    generateAccessToken
} = require('../services/token')


exports.signup = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                error: "User already exists !",
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        })
        if (newUser) {
            let { _id, name, email, role } = newUser;
            const token = await generateAccessToken({ _id, email, role })
            // response token and user info
            res.status(201).json({ token, user: { _id, name, email, role } })
        }
    } catch (error) {
        return res.status(400).json({ error })
    }
}

exports.signin = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            const isPasswordMatch = await existingUser.authenticate(req.body.password)
            if (isPasswordMatch) {
                const { _id, name, email, profilePicture, role } = existingUser
                const token = await generateAccessToken({ _id, email, role })
                // response token and user info
                res.status(200).json({ token, user: { _id, name, email, profilePicture, role } })
            } else {
                res.status(400).json({ error: "Password incorrect" })
            }
        } else {
            return res.status(400).json({ error: "Email does not exist" })
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}

exports.signout = async (req, res) => {
    try {
        const userId = req.user._id
        res.status(200).json({ message: 'Delete refresh token successfully' })
    } catch (error) {
        res.status(400).json({ error })
    }
}

exports.signinWithGoogle = async (req, res) => {
    const { token } = req.body
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: client_id,
        })
        const { name, email, picture } = ticket.getPayload()
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            const { _id, name, email, profilePicture, role } = existingUser
            const token = await generateAccessToken({ _id, email, role })
            // response token and user info
            res.status(201).json({ token, user: { _id, name, email, profilePicture, role } })
        } else {
            const newUser = {
                name,
                email,
                profilePicture: picture,
            }
            let user = await User.create(newUser)
            const { _id, name, email, profilePicture, role } = user
            const token = await generateAccessToken({ _id, email, role })
            // response token and user info
            res.status(201).json({ token, user: { _id, name, email, profilePicture, role } })
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}

exports.isUserLoggedIn = async (req, res) => {
    try {
        const userObj = await User.findOne({ _id: req.user._id })
        const { _id, name, email, role, profilePicture } = userObj
        const user = { _id, name, email, role, profilePicture }
        res.status(200).json({ user })
    } catch (error) {
        res.status(400).json({ error })
    }
}

exports.updateForgetPassword = async (req, res) => {
    const { otp, password, email } = req.body
    try {
        const user = await User.findOne({ email })
        if (user) {
            const otpObj = await Otp.findOne({
                user: user._id, generatedOtp: otp,
            })
            if (otpObj) {
                const hashPassword = await bcrypt.hash(password, 10)
                const userObj = await User.findOneAndUpdate({ email }, { password: hashPassword }, { upsert: true })
                if (userObj) {
                    res.status(202).json({ message: "Updated successfully" })
                } else {
                    res.status(400).json({ error: "Something went wrong" })
                }
            } else {
                return res.status(400).json({ error: "OTP is wrong" })
            }
        } else {
            return res.status(400).json({ error: "Email does not exists" })
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}

exports.sendOtpToEmail = async (req, res) => {
    const { email } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString()
            const isSent = await sendOtp(email, otp)
            if (isSent) {
                await Otp.create({ user: existingUser._id, generatedOtp: otp })
                res.status(201).json({ message: "Otp sent to email successfully" })
            } else {
                res.status(400).json({ error: "Can't send otp now !" })
            }
        } else {
            res.status(400).json({ error: "Email does not exists" })
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}
