const express = require('express');
const { requireSignin, userMiddleware, adminMiddleware } = require('../common-middleware');
const { addOrder, getOrder, getOrders , updateOrderStatus, getCustomerOrders } = require('../controller/order');

const router = express.Router();

router.post('/order/add', requireSignin, userMiddleware, addOrder);
router.post('/order/getOrder', requireSignin, userMiddleware, getOrder);
router.get('/order/getOrders', requireSignin, userMiddleware, getOrders);
router.post('/order/updateType', requireSignin, adminMiddleware, updateOrderStatus);
router.post('/order/getCustomerOrders', requireSignin, adminMiddleware, getCustomerOrders);
router.get('/order/getOrders', requireSignin, userMiddleware, getOrders);


module.exports = router;
