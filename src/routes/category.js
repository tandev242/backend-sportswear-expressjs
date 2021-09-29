const express = require('express');
const { addCategory, getCategories, deleteCategories, updateCategories } = require('../controller/category');
const { requireSignin, adminMiddleware, uploadCloud } = require('../common-middleware');
const router = express.Router();

router.post('/category/add', requireSignin, adminMiddleware, uploadCloud.single("categoryImage"), addCategory);
router.get('/category/getCategories', getCategories);
router.post('/category/delete', requireSignin, adminMiddleware, deleteCategories)
router.post('/category/update', requireSignin, adminMiddleware, uploadCloud.none(), updateCategories)

module.exports = router;
