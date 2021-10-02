const express = require('express');
const passport = require('passport');
const { returnTokenForClient } = require('../controller/auth');
const router = express.Router();

router.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    returnTokenForClient,
    (req, res) => {
        res.redirect('/');
    }
);
module.exports = router;