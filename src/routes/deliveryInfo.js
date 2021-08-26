const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { addDeliveryInfo, getDeliveryInfo } = require('../controller/deliveryInfo');


const router = express.Router();

router.post('/deliveryInfo/add', requireSignin, userMiddleware, addDeliveryInfo);
router.get('/deliveryInfo/get', requireSignin, userMiddleware, getDeliveryInfo);

module.exports = router;
