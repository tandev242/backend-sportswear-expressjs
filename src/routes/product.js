const express = require('express');
const { addProduct, getProductsBySlug, getProductById, deleteProductById, getProducts , updateProduct, updateQty, updateSizes} = require('../controller/product');
const { requireSignin, adminMiddleware } = require('../common-middleware');

const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + file.originalname);
    },
});
const upload = multer({ storage });


router.post('/product/add', requireSignin, adminMiddleware, upload.array("productPicture"), addProduct);
router.get('/product/:type/:slug', getProductsBySlug);
router.get('/product/:id', getProductById);
router.delete('/product/deleteProductById', requireSignin, adminMiddleware, deleteProductById);
router.post('/product/getProducts', requireSignin, adminMiddleware, getProducts);
router.post('/product/update', requireSignin, adminMiddleware, updateProduct);
router.post('/product/updateQty', requireSignin, adminMiddleware, updateQty);
router.post('/product/updateSizes', requireSignin, adminMiddleware, updateSizes);

module.exports = router;
