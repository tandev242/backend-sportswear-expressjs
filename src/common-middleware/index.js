const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')
const shortid = require('shortid')
const nodemailer = require("nodemailer");
const Otp = require("../models/otp");

require('dotenv').config()
// image upload to cloudinary storage
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) {
        cb(null, file.originalname + "-" + shortid.generate());
    }
});

exports.uploadCloud = multer({ storage });




// Auth User
exports.requireSignin = (req, res, next) => {
    if (req.headers.authorization) {

        // headers.authorization kieu "User sdadsadsadsasdas" la table + token 
        const token = req.headers.authorization.split(' ')[1];
        // decode token de lay User theo cai secret key
        const user = jwt.verify(token, process.env.JWT_SECRET);

        // luu user vao request
        req.user = user;
    } else {
        return res.status(400).json({ message: "Authorization required" });
    }
    next();
}

exports.userMiddleware = (req, res, next) => {
    if (req.user.role !== "user") {
        return res.status(400).json({ message: "User access denied" });
    }
    next();
}
exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(400).json({ message: "Admin access denied" });
    }
    next();
}

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
        subject: "Mã OTP sẽ hết hạn sau 10 phút, OTP của bạn là: ", // Subject of the mail.
        html: `<h1> ${otp} </h1>`, // Sending OTP
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