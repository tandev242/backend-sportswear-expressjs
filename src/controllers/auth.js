const User = require("../models/user");
const Otp = require("../models/otp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const client_id = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(client_id);

const generateJwtToken = (_id, email, role) => {
  return jwt.sign({ _id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) {
      return res.status(400).json({
        error: "User already registered",
      });
    }
    const { name, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      name,
      email,
      password: hash_password,
      username: "NM" + shortid.generate(),
    });

    _user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
      if (user) {
        const token = generateJwtToken(user._id, user.email, user.role);
        const { _id, name, email, role } = user;
        return res.status(201).json({
          token,
          user: { _id, name, email, role },
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) {
      return res.status(400).json({
        error: error,
      });
    }
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword) {
        const token = generateJwtToken(user._id, user.email, user.role);
        const { _id, name, email, role, profilePicture } = user;
        res.status(200).json({
          token,
          user: { _id, name, email, role, profilePicture },
        });
      } else {
        return res.status(400).json({
          message: "Email or password incorrect",
        });
      }
    } else {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully ....!",
  });
};

exports.signinWithGoogle = async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: client_id,
  });
  const { name, email, picture } = ticket.getPayload();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const { _id, name, email, role, profilePicture } = existingUser;
    const token = generateJwtToken(_id, email, role);
    const user = { _id, name, email, role, profilePicture };
    res.status(201).json({ user, token });
  } else {
    const newUser = {
      name,
      email,
      username: "GG" + shortid.generate(),
      profilePicture: picture,
    };
    let user = await new User(newUser).save();
    const token = generateJwtToken(user._id, user.email, user.role);
    res.status(201).json({ user, token });
  }
};

exports.isUserLoggedIn = async (req, res) => {
  try {
    const userObj = await User.findOne({ _id: req.user._id });
    const { _id, name, email, role, profilePicture } = userObj;
    const user = { _id, name, email, role, profilePicture };
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.updateForgetPassword = async (req, res) => {
  const { otp, password, email } = req.body;
  const dateNow = new Date(Date.now())
  const currentDateSubtractTenMinutes = new Date(dateNow.getTime() - 600000)
  const user = await User.findOne({ email }).exec();
  if (password) {
    const otpObj = await Otp.findOneAndDelete({
      user: user._id, generatedOtp: otp,
      createdAt: { $gte: currentDateSubtractTenMinutes, $lt: dateNow }
    }).exec()
    if (otpObj) {
      const hashPassword = await bcrypt.hash(password, 10);
      const userObj = await User.findOneAndUpdate({ email }, { password: hashPassword }, { upsert: true }).exec();
      if (userObj) {
        res.status(202).json({ message: "updated successfully" });
      } else {
        res.status(400).json({ error: "Something went wrong" });
      }
    } else {
      return res.status(400).json({ error: "OTP is wrong" });
    }
  } else {
    return res.status(400).json({ error: "Password is not valid" });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "laptrinhwebcungtandz@gmail.com", //email ID
    pass: "tan240600", //Password
  },
});
exports.sendOtpToEmail = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }).exec((error, user) => {
    if (error) {
      return res.status(400).json({ error })
    }
    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const details = {
        from: "DoubleT Sport", // sender address same as above
        to: email, // Receiver's email id
        subject: "Mã OTP sẽ hết hạn sau 10 phút, OTP của bạn là: ", // Subject of the mail.
        html: `<h1> ${otp} </h1>`, // Sending OTP
      };
      try {
        transporter.sendMail(details, function (error, data) {
          if (error) res.status(400).json({ error });
          if (data) {
            const otpObj = new Otp({ user: user._id, generatedOtp: otp });
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
      } catch (error) {
        res.status(400).json({ error });
      }
    } else {
      res.status(400).json({ error: "user is not exist" });
    }
  })
};
