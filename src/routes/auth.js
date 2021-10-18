const express = require('express');
const { signup, signin, signinWithGoogle, signout } = require('../controller/auth');
const { validateSignupRequest, validateSigninRequest, isRequestValidated } = require('../validators/auth');
const { requireSignin } = require('../common-middleware');

const router = express.Router();

router.post('/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/v1/auth/google', signinWithGoogle);
router.post('/signout', signout);
router.post('/isUserLoggedIn', requireSignin, (req, res) => res.status(200).json({ authenticate: true }));

module.exports = router;