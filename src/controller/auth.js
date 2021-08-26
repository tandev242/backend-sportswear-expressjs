const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shortid = require('shortid');


const generateJwtToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
}

exports.signup = (req, res) => {
    User.findOne({ email: req.body.email })
        .exec(
            async (error, user) => {
                if (user) {
                    return res.status(400).json({
                        error: "User already registered"
                    })
                }
                const { name, email, password } = req.body;
                const hash_password = await bcrypt.hash(password, 10);
                const _user = new User({
                    name,
                    email,
                    password: hash_password,
                    username: "NM" + shortid.generate()
                })

                _user.save((error, user) => {
                    if (error) {
                        return res.status(400).json({
                            message: "Something went wrong"
                        })
                    }
                    if (user) {
                        const token = generateJwtToken(user._id, user.role);
                        const { _id, name, email, role } = user;
                        return res.status(201).json({
                            token,
                            user: { _id, name, email, role },
                        });
                    }
                })

            }
        )
}

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email }).exec(
        async (error, user) => {
            if (error) {
                return res.status(400).json({
                    error: error,
                })
            }
            if (user) {
                const isPassword = await user.authenticate(req.body.password);
                if (isPassword) {
                    const token = generateJwtToken(user._id, user.role);
                    const { _id, name, email, role } = user;
                    res.status(200).json({
                        token,
                        user: { _id, name, email, role },
                    })
                } else {
                    return res.status(400).json({
                        message: "Email or password incorrect",
                    })
                }
            } else {
                return res.status(400).json({
                    message: "Something went wrong"
                })
            }


        }
    )
}

exports.signout = (req, res) =>{
    res.clearCookie("token");
    res.status(200).json({
        message: "Signout successfully ....!"
    })
}

exports.signinWithGoogle = (req, res) => {
    //signinWithGoogle
}