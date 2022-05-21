const Otp = require("../models/otp")

exports.verifyOtp = async (req, res) => {
    const { userId, otp } = req.body
    try {
        const otpObj = await Otp.findOneAndDelete({ user: userId, generatedOtp: otp })
        if (otpObj) {
            res.status(200).json({ message: "Otp is valid" })
        } else {
            res.status(400).json({ error: "Otp expired or invalid" })
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}