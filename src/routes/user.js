const express = require('express');
const { requireSignin, adminMiddleware } = require('../common-middleware');
const { updateUser, getUsers, deleteUserById } = require('../controller/user');


const router = express.Router();

router.post('/user/getUsers', requireSignin, adminMiddleware, getUsers);
router.post('/user/update', requireSignin, updateUser);
router.post('/user/delete', requireSignin,adminMiddleware, deleteUserById);

module.exports = router;
