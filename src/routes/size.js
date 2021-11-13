const express = require('express');
const { requireSignin , adminMiddleware } = require('../common-middleware');
const { addSize, getAllSizes } = require('../controllers/size');


const router = express.Router();

router.post('/size/add', requireSignin, adminMiddleware, addSize);
router.get('/size/getAllSizes', getAllSizes);

module.exports = router;
