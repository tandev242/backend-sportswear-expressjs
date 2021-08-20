const express = require('express');
const { signup, signin , signinWithGoogle } = require('../controller/auth');
const { validateSignupRequest, validateSigninRequest, isRequestValidated } = require('../validators/auth');
const router = express.Router();

router.post('/signup', validateSignupRequest, isRequestValidated , signup);
router.post('/signin', validateSigninRequest, isRequestValidated , signin);
router.post('/signin/google', signinWithGoogle);

module.exports = router;