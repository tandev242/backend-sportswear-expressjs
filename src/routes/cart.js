const express = require('express');
const { requireSignin } = require('../common-middleware');
const {addToCart, getCartItems, removeCartItems} = require('../controller/cart');


const router = express.Router();

router.post('/cart/addToCart', requireSignin, addToCart);
router.get('/cart/getCartItems',requireSignin, getCartItems);
router.delete('/cart/removeItem',requireSignin, removeCartItems);

module.exports = router;
