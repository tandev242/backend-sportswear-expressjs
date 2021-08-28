const express = require('express');
const { requireSignin , adminMiddleware } = require('../common-middleware');
const { addSizeProduct, updateQtyBySizeProduct } = require('../controller/sizeProduct');


const router = express.Router();

router.post('/sizeProduct/add', requireSignin, adminMiddleware, addSizeProduct);
router.post('/sizeProduct/updateQtyBySizeProduct', requireSignin, adminMiddleware, updateQtyBySizeProduct);

module.exports = router;
