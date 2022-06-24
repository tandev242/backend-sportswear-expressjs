const User = require("../models/user")
const Otp = require("../models/otp")
const bcrypt = require("bcrypt")

exports.getUsers = (req, res) => {
  User.find({ isDisable: { $ne: true } }).exec((error, users) => {
    if (error) {
      return res.status(400).json({ error })
    }
    if (users) {
      return res.status(200).json({ users })
    } else {
      return res.status(400).json({ error: "something went wrong" })
    }
  })
}

exports.updateUser = async (req, res) => {
  const { user } = req.body
  try {
    const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { ...user })
    if (updatedUser) {
      res.status(202).json({ message: "updated successfully" })
    } else {
      res.status(400).json({ error: "something went wrong" })
    }
  } catch (error) {
    res.status(400).json({ error })
  }
}

exports.updateUserInfo = async (req, res) => {
  const { otp, name, password } = req.body
  const payload = { name }
  try {
    if (password) {
      const otpObj = await Otp.findOneAndDelete({ user: req.user._id, generatedOtp: otp })
      if (otpObj) {
        const hashedPassword = await bcrypt.hash(password, 10)
        payload.password = hashedPassword
      } else {
        return res.status(400).json({ error: "OTP is wrong" })
      }
    }
    if (req.file) {
      payload.profilePicture = req.file.path
    }
    const userObj = await User.findOneAndUpdate({ _id: req.user._id }, { ...payload }, { upsert: true })
    if (userObj) {
      res.status(202).json({ message: "Updated successfully" })
    } else {
      res.status(400).json({ error: "Something went wrong" })
    }
  } catch (error) {
    res.status(400).json({ error })
  }
}

exports.deleteUserById = async (req, res) => {
  const { _id } = req.body.payload
  try {
    const user = await User.findOneAndUpdate({ _id }, { isDisabled: true })
    if (user) {
      res.status(204).json({ message: "deleted successfully" })
    } else {
      res.status(400).json({ error: "something went wrong" })
    }
  } catch (error) {
    res.status(400).json({ error })
  }
}





