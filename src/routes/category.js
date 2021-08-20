const express = require('express');
const {addCategory, getCategories} = require('../controller/category');
const {requireSignin} = require('../common-middleware');

const router = express.Router();

router.post('/category/add', requireSignin, addCategory);
router.get('/category/getCategories', getCategories);

module.exports = router;
