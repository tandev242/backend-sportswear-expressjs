const express = require('express');
const { requireSignin } = require('../common-middleware');
const { addDeliveryInfo, getDeliveryInfo } = require('../controller/deliveryInfo');


const router = express.Router();

router.post('/deliveryInfo/add',requireSignin, addDeliveryInfo);
router.get('/deliveryInfo/get',requireSignin ,getDeliveryInfo);

module.exports = router;
