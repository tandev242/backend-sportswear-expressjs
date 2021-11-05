const express = require('express');
const { requireSignin, adminMiddleware, userMiddleware } = require('../common-middleware');
const { updateUser, getUsers, deleteUserById, sendOtpToEmail } = require('../controller/user');


const router = express.Router();

router.post('/user/getUsers', requireSignin, adminMiddleware, getUsers);
router.post('/user/update', requireSignin, updateUser);
router.post('/user/delete', requireSignin,adminMiddleware, deleteUserById);
router.post('/user/sendOtpToEmail', requireSignin,userMiddleware, sendOtpToEmail);

module.exports = router;
