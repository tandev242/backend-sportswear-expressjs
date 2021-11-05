const User = require("../models/user");
const Otp = require("../models/otp");
const nodemailer = require("nodemailer");

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



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "laptrinhwebcungtandz@gmail.com", //email ID
    pass: "tan240600", //Password
  },
});
exports.sendOtpToEmail = (req, res) => {
  const { email, _id } = req.user;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const details = {
    from: "DoubleT Sport", // sender address same as above
    to: email, // Receiver's email id
    subject: "DoubleT Sport - Mã OTP của bạn là: ", // Subject of the mail.
    html: otp, // Sending OTP
  };
  transporter.sendMail(details, function (error, data) {
    if (error) res.status(400).json({ error });
    if (data) {
      const otpObj = new Otp({ user: _id, generatedOtp: otp });
      otpObj.save((error, otp) => {
        if (error) return res.status(400).json({ error });
        if (otp) {
          res.status(201).json({ message: "generate Otp successfully" });
        } else {
          res.status(400).json({ error: "something went wrong" });
        }
      });
    } else {
      res.status(400).json({ error: "something went wrong" });
    }
  });
};
