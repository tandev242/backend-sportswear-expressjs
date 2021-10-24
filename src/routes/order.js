const express = require('express');
const { requireSignin, userMiddleware, adminMiddleware } = require('../common-middleware');
const { addOrder, getOrder, getOrders, updateOrderStatus, getCustomerOrders, paymentWithMomo } = require('../controller/order');

const router = express.Router();

router.post('/order/add', requireSignin, userMiddleware, addOrder);
router.post('/order/getOrder', requireSignin, userMiddleware, getOrder);
router.post('/order/getOrders', requireSignin, userMiddleware, getOrders);
router.post('/order/updateType', requireSignin, adminMiddleware, updateOrderStatus);
router.post('/order/getCustomerOrders', requireSignin, adminMiddleware, getCustomerOrders);
router.post('/order/paymentWithMomo', requireSignin, userMiddleware, paymentWithMomo);

module.exports = router;
