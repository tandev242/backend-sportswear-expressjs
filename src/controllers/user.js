const User = require("../models/user");
const Otp = require("../models/otp");
const bcrypt = require("bcrypt");

exports.getUsers = (req, res) => {
  User.find({}).exec((error, users) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (users) {
      return res.status(200).json({ users });
    } else {
      return res.status(400).json({ error: "something went wrong" });
    }
  });
};

exports.updateUser = (req, res) => {
  const { user } = req.body;
  User.findOneAndUpdate({ _id: user._id }, { ...user }).exec(
    (error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ message: "updated successfully" });
      } else {
        res.status(400).json({ error: "something went wrong" });
      }
    }
  );
};

exports.updateUserInfo = async (req, res) => {
  const { otp, name, password } = req.body;
  const dateNow = new Date(Date.now())
  const currentDateSubtractTenMinutes = new Date(dateNow.getTime() - 600000)

  const payload = { name };
  if (password) {
    const otpObj = await Otp.findOneAndDelete({
      user: req.user._id, generatedOtp: otp,
      createdAt: { $gte: currentDateSubtractTenMinutes, $lt: dateNow }
    }).exec()
    if (otpObj) {
      const hashPassword = await bcrypt.hash(password, 10);
      payload.password = hashPassword;
    } else {
      return res.status(400).json({ error: "OTP is wrong" });
    }
  }
  if (req.file) {
    payload.profilePicture = req.file.path;
  }
  const userObj = await User.findOneAndUpdate({ _id: req.user._id }, { ...payload }, { upsert: true }).exec();
  if (userObj) {
    res.status(202).json({ message: "updated successfully" });
  } else {
    res.status(400).json({ error: "Something went wrong" });
  }
};

exports.deleteUserById = (req, res) => {
  const { _id } = req.body.payload;
  User.findOneAndDelete({ _id }).exec((error, result) => {
    if (error) return res.status(400).json({ error });
    if (result) {
      res.status(204).json({ message: "deleted successfully" });
    } else {
      res.status(400).json({ error: "something went wrong" });
    }
  });
};





