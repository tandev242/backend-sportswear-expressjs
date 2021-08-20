const express = require('express');
const { addProduct, getProductsBySlug ,getProductById, deleteProductById, getProducts} = require('../controller/product');
const { requireSignin } = require('../common-middleware');

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


router.post('/product/add', requireSignin, upload.array("productPicture"), addProduct);
router.get('/products/:type/:slug', getProductsBySlug);
router.get('/product/:id', getProductById);
router.delete('/product/deleteProductById' , requireSignin, deleteProductById);
router.get('/products/getProducts', getProducts)

module.exports = router;
