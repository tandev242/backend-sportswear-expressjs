const express = require('express');
const { addBrand, getBrands, deleteBrands, updateBrands } = require('../controller/brand');
const { requireSignin, adminMiddleware, uploadCloud } = require('../common-middleware');



const router = express.Router();

router.post('/brand/add', requireSignin, adminMiddleware, uploadCloud.single("brandImage"), addBrand);
router.get('/brand/getBrands', getBrands);
router.post('/brand/deleteBrands', requireSignin, adminMiddleware, deleteBrands);
router.post('/brand/updatebrands', requireSignin, adminMiddleware, updateBrands);

module.exports = router;
