const express = require('express')
const { requireSignin, userMiddleware } = require('../common-middleware')
const { addDeliveryInfo, getDeliveryInfo, deleteDeliveryInfo, setDefaultDeliveryInfo } = require('../controllers/deliveryInfo')
const { validateAddDeliveryInfoRequest, isRequestValidated } = require('../validators')


const router = express.Router()

router.post('/add', 
    validateAddDeliveryInfoRequest,
    isRequestValidated,
    addDeliveryInfo)
router.get('/get', requireSignin, userMiddleware, getDeliveryInfo);
router.post('/delete', requireSignin, userMiddleware, deleteDeliveryInfo);
router.post('/setDefaultDeliveryInfo', requireSignin, userMiddleware, setDefaultDeliveryInfo)

module.exports = router
