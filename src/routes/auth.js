const express = require('express');
const { signup, signin, signinWithGoogle, signout, isUserLoggedIn } = require('../controllers/auth');
const { validateSignupRequest, validateSigninRequest, isRequestValidated } = require('../validators/auth');
const { requireSignin, userMiddleware, sendOtpToEmail } = require('../common-middleware');

const router = express.Router();

router.post('/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/v1/auth/google', signinWithGoogle);
router.post('/signout', signout);
router.post('/isUserLoggedIn', requireSignin, isUserLoggedIn);
router.post('/sendOtpToEmail', requireSignin, userMiddleware, sendOtpToEmail);

module.exports = router;