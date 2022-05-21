const { check, validationResult } = require('express-validator')

exports.validateSignupRequest = [
    check('name')
        .notEmpty()
        .withMessage('Name is required'),

    check('email')
        .isEmail()
        .withMessage('Valid Email is required'),

    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 character long')
]

exports.validateForgotPasswordRequest = [
    check('email')
        .isEmail()
        .withMessage('Valid Email is required'),

    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 character long'),

    check('otp')
        .isNumeric()
        .isLength({ min: 6 })
        .withMessage('Otp must be 6 numbers'),
]

exports.validateUpdateUserInfoRequest = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
]

exports.validateAddDeliveryInfoRequest = [
    check('address')
        .notEmpty()
        .withMessage('Address is required')
]

exports.validateSigninRequest = [
    check('email')
        .isEmail()
        .withMessage('Valid Email is required'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 character long')
]

exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.array().length > 0) {
        return res.status(400).json({ errors: errors.array()[0].msg })
    }
    next()
}