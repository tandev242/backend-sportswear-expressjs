const express = require('express');
const { requireSignin, adminMiddleware } = require('../common-middleware');
const { statisticRevenue } = require('../controllers/statistic');


const router = express.Router();

router.post('/statistic/revenueMonthly', requireSignin, adminMiddleware, statisticRevenue);

module.exports = router;
