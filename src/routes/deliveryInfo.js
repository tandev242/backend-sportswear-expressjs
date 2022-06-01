const express = require('express')
const { requireSignin, userMiddleware } = require('../common-middleware')
const { addDeliveryInfo, getDeliveryInfo, deleteDeliveryInfo, setDefaultDeliveryInfo } = require('../controllers/deliveryInfo')
const { validateAddDeliveryInfoRequest, isRequestValidated } = require('../validators')


const router = express.Router()

router.post('/deliveryInfo/add', 
    validateAddDeliveryInfoRequest,
    isRequestValidated,
    addDeliveryInfo)
router.get('/deliveryInfo/get', requireSignin, userMiddleware, getDeliveryInfo);
router.post('/deliveryInfo/delete', requireSignin, userMiddleware, deleteDeliveryInfo);
router.post('/deliveryInfo/setDefaultDeliveryInfo', requireSignin, userMiddleware, setDefaultDeliveryInfo)

module.exports = router
