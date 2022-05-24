const express = require('express')
const { signup, signin, signinWithGoogle, signout, isUserLoggedIn, sendOtpToEmail, updateForgetPassword } = require('../controllers/auth')
const { verifyOtp } = require('../controllers/otp')
const { validateSignupRequest, validateSigninRequest, validateForgotPasswordRequest, isRequestValidated } = require('../validators')
const { requireSignin } = require('../common-middleware')

const router = express.Router()

router.post('/auth/signup', validateSignupRequest, isRequestValidated, signup)
router.post('/auth/signin',validateSigninRequest, isRequestValidated, signin)
router.post('/auth/signin/google', signinWithGoogle)
router.post('/auth/signout', requireSignin, signout)
router.post('/auth/verifyOtp', verifyOtp)
router.post('/auth/sendOtpToEmail', sendOtpToEmail)
router.post('/auth/updateForgetPassword', validateForgotPasswordRequest, updateForgetPassword)
router.post('/auth/isUserLoggedIn', requireSignin, isUserLoggedIn)

module.exports = router