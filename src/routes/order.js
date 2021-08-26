const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { addOrder, getOrder, getOrders } = require('../controller/order');

const router = express.Router();

router.post('/order/add', requireSignin, userMiddleware, addOrder);
router.post('/order/getOrder', requireSignin, userMiddleware, getOrder);
router.get('/order/getOrders', requireSignin, userMiddleware, getOrders);

module.exports = router;
