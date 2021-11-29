const express = require('express');
const { requireSignin, userMiddleware, adminMiddleware } = require('../common-middleware');
const { addOrder, getOrder, getOrders, updateStatus, getCustomerOrders, paymentWithMomo, addOrderByPaymentMomo } = require('../controllers/order');

const router = express.Router();

router.post('/order/add', requireSignin, userMiddleware, addOrder);
router.post('/order/addOrderByPaymentMomo', addOrderByPaymentMomo);
router.post('/order/getOrder', requireSignin, userMiddleware, getOrder);
router.post('/order/getOrders', requireSignin, userMiddleware, getOrders);
router.post('/order/updateType', requireSignin, updateStatus);
router.post('/order/getCustomerOrders', requireSignin, adminMiddleware, getCustomerOrders);
router.post('/order/paymentWithMomo', requireSignin, userMiddleware, paymentWithMomo);

module.exports = router;
