const express = require('express');
const {addBrand, getBrands} = require('../controller/brand');
const { requireSignin, adminMiddleware } = require('../common-middleware');


const router = express.Router();

router.post('/brand/add',requireSignin, adminMiddleware, addBrand);
router.get('/brand/getBrands', getBrands);

module.exports = router;
