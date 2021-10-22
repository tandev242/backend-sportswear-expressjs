const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { addDeliveryInfo, getDeliveryInfo, deleteDeliveryInfo, setDefaultDeliveryInfo } = require('../controller/deliveryInfo');


const router = express.Router();

router.post('/deliveryInfo/add', requireSignin, userMiddleware, addDeliveryInfo);
router.get('/deliveryInfo/get', requireSignin, userMiddleware, getDeliveryInfo);
router.post('/deliveryInfo/delete', requireSignin, userMiddleware, deleteDeliveryInfo);
router.post('/deliveryInfo/setDefaultDeliveryInfo', requireSignin, userMiddleware, setDefaultDeliveryInfo);

module.exports = router;
