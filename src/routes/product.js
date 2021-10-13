const express = require('express');
const { addProduct, getProductsBySlug,
    getProductById, getProductDetailsBySlug,
    deleteProductById, getProducts,
    updateProduct, updateQty, updateSizes,
    searchByProductName,
    updateDiscountPercent } = require('../controller/product');
const { requireSignin, adminMiddleware, uploadCloud } = require('../common-middleware');
const router = express.Router();

router.post('/product/add', requireSignin, adminMiddleware, uploadCloud.array("productPicture"), addProduct);
router.get('/product/:type/:slug', getProductsBySlug);
router.get('/product/:slug', getProductDetailsBySlug);
router.post('/product/searchByProductName', searchByProductName);
router.post('/product/getById', getProductById);
router.delete('/product/deleteProductById', requireSignin, adminMiddleware, deleteProductById);
router.post('/product/getProducts', getProducts);
router.post('/product/update', requireSignin, adminMiddleware, updateProduct);
router.post('/product/updateQty', requireSignin, adminMiddleware, updateQty);
router.post('/product/updateSizes', requireSignin, adminMiddleware, updateSizes);
router.post('/product/updateDiscountPercent', requireSignin, adminMiddleware, updateDiscountPercent);

module.exports = router;
