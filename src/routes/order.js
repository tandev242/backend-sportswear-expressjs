const express = require('express');
const { requireSignin } = require('../common-middleware');
const { addOrder, getOrder, getOrders } = require('../controller/order');

const router = express.Router();

router.post('/order/add', requireSignin, addOrder);
router.post('/order/getOrder', requireSignin, getOrder);
router.get('/order/getOrders', requireSignin, getOrders);

module.exports = router;
