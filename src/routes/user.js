const express = require('express');
const { requireSignin, adminMiddleware, userMiddleware, uploadCloud } = require('../common-middleware');
const { updateUser, getUsers, deleteUserById, updateUserInfo } = require('../controllers/user');

const router = express.Router();

router.post('/user/getUsers', requireSignin, adminMiddleware, getUsers);
router.post('/user/update', requireSignin, adminMiddleware, updateUser);
router.post('/user/updateUserInfo', requireSignin, userMiddleware, uploadCloud.single("profilePicture"), updateUserInfo);
router.post('/user/delete', requireSignin, adminMiddleware, deleteUserById);

module.exports = router;
