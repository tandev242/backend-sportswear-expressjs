const express = require('express');
const {addCategory, getCategories, deleteCategories} = require('../controller/category');
const {requireSignin , adminMiddleware} = require('../common-middleware');

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


router.post('/category/add', requireSignin, adminMiddleware ,upload.single("categoryImage"), addCategory);
router.get('/category/getCategories', getCategories);
router.post('/category/delete', requireSignin, adminMiddleware , deleteCategories)

module.exports = router;
