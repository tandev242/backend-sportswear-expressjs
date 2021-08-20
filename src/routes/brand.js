const express = require('express');
const {addBrand, getBrands} = require('../controller/brand');


const router = express.Router();

router.post('/brand/add', addBrand);
router.get('/brand/getBrands', getBrands);

module.exports = router;
