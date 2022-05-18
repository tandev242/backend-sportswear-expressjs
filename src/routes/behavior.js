const express = require("express")
const { addBehavior } = require("../controllers/behavior")
const { requireSignin } = require("../common-middleware")

const router = express.Router()

router.post("/recom/addBehavior", requireSignin, addBehavior)

module.exports = router

