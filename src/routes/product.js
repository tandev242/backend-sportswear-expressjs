const express = require('express');
const { addProduct, getProductsBySlug, getProductById, deleteProductById, getProducts , updateProduct, updateQty, updateSizes} = require('../controller/product');
const { requireSignin, adminMiddleware, uploadCloud } = require('../common-middleware');
const router = express.Router();

router.post('/product/add', requireSignin, adminMiddleware, uploadCloud.array("productPicture"), addProduct);
router.get('/product/:type/:slug', getProductsBySlug);
router.get('/product/:id', getProductById);
router.delete('/product/deleteProductById', requireSignin, adminMiddleware, deleteProductById);
router.post('/product/getProducts', requireSignin, adminMiddleware, getProducts);
router.post('/product/update', requireSignin, adminMiddleware, updateProduct);
router.post('/product/updateQty', requireSignin, adminMiddleware, updateQty);
router.post('/product/updateSizes', requireSignin, adminMiddleware, updateSizes);

module.exports = router;
