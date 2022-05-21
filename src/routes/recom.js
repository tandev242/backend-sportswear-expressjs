const express = require("express")
const { getRecommendedProductsById } = require("../controllers/recom")
const { addBehavior, getRecommendedProductsByBehavior } = require("../controllers/behavior")
const { requireSignin } = require("../common-middleware")

const router = express.Router()

router.post("/recom/addBehavior", requireSignin, addBehavior)
router.post("/recom/getRecommendedProductsById", getRecommendedProductsById)
router.post("/recom/getRecommendedProductsByBehavior", requireSignin, getRecommendedProductsByBehavior)

module.exports = router

