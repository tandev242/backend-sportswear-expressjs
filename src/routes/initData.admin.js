const express = require('express');
const { requireSignin, adminMiddleware } = require('../common-middleware');
const { initData } = require('../controller/initData.admin');
const router = express.Router();


router.post('/initData', requireSignin, adminMiddleware, initData);


module.exports = router;