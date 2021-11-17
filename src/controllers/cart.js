const Cart = require("../models/cart");

function runUpdate(condition, updateData) {
    return new Promise((resolve, reject) => {
        // cai nay la bat dong bo 
        Cart.findOneAndUpdate(condition, updateData, { upsert: true })
            .then((result) => resolve())
            .catch((err) => reject(err));
    });
}

exports.addToCart = (req, res) => {
    const { cartItems } = req.body;
    if (cartItems) {
        Cart.findOne({ user: req.user._id }).exec((error, cart) => {
            if (error) return res.status(400).json({ error });
            // neu cart ton tai thi add CartItems vao nguoc lai thi khoi tao cart
            if (cart) {
                let promiseArray = [];
                cartItems.forEach((cartItem) => {
                    const product = cartItem.product;
                    const size = cartItem.size;
                    const item = cart.cartItems.find(c => c.product == product && c.size == size);
                    let condition, update;
                    if (item) {
                        condition = { user: req.user._id, "cartItems.product": product, "cartItems.size": size };
                        update = {
                            $set: {
                                "cartItems.$": cartItem
                            }
                        }
                    } else {
                        condition = { user: req.user._id };
                        update = {
                            $push: {
                                cartItems: cartItem
                            }
                        }
                    }
                    promiseArray.push(runUpdate(condition, update));
                })
                Promise.all(promiseArray)
                    .then(result => res.status(201).json({ message: "add to cart successfully" }))
                    .catch(error => res.status(400).json({ error }))

            } else {
                const cart = new Cart({
                    user: req.user._id,
                    cartItems
                });
                cart.save((error, cart) => {
                    if (error) return res.status(400).json({ error });
                    if (cart) {
                        res.status(201).json({ message: "add to cart successfully" });
                    }
                })
            }
        })
    } else {
        return res.status(400).json({ error: "CartItems is not allowed to be null" });
    }
}

exports.getCartItems = (req, res) => {
    Cart.findOne({ user: req.user._id })
        .populate("cartItems.product", "_id name slug price discountPercent productPictures")
        .populate("cartItems.size", "_id size")
        .exec((error, cart) => {
            if (error) return res.status(400).json({ error })
            if (cart) {
                let cartItems = [];
                cart.cartItems.forEach((item) => {
                    cartItems.push({
                        product: item.product,
                        size: item.size,
                        quantity: item.quantity
                    })
                })
                return res.status(200).json({ cartItems });
            }
            res.status(400).json({ error: "Something went wrong" });
        })
}

// Xoa 1 san pham trong CartItems
exports.removeCartItems = (req, res) => {
    const { cartItem } = req.body;
    if (cartItem) {
        Cart.updateOne({ user: req.user._id },
            {
                $pull: {
                    cartItems: {
                        product: cartItem.product,
                        size: cartItem.size
                    }
                }
            }).exec((error, result) => {
                if (error) return res.status(400).json({ error });
                if (result) {
                    return res.status(202).json({ result });
                }
                return res.status(400).json({ error: "something went wrong" });
            })
    } else {
        res.status(400).json({ error: "Item  is not allowed to be null" });
    }
}
