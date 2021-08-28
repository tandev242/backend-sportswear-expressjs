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
    Cart.findOne({ user: req.user._id }).exec((error, cart) => {
        if (error) return res.status(400).json({ error });
        // neu cart ton tai thi add CartItems vao nguoc lai thi khoi tao cart
        if (cart) {
            let promiseArray = [];
            cartItems.forEach((cartItem) => {
                const product = cartItem.product;
                const item = cart.cartItems.find(c => c.product == product);
                let condition, update;
                if (item) {
                    condition = { user: req.user._id, "cartItems.product": product };
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
                .then(res => res.status(201).json({ res }))
                .catch(error => res.status(400).json({ error }))

        } else {
            const cart = new Cart({
                user: req.user._id,
                cartItems
            });
            cart.save((error, cart) => {
                if (error) return res.status(400).json({ error });
                if (cart) {
                    res.status(201).json({ cart });
                }
            })
        }

    })
}

exports.getCartItems = (req, res) => {
    Cart.findOne({ user: req.user._id })
        .populate("cartItems.product", "_id name price productPictures")
        .populate("cartItems.size", "_id size")
        .exec((error, cart) => {
            if (error) return res.status(400).json({ error })
            if (cart) {
                let cartItems = {};
                cart.cartItems.forEach((item) => {
                    cartItems[item.product._id.toString()] = {
                        _id: item.product._id.toString(),
                        name: item.product.name,
                        price: item.product.price,
                        img: item.product.productPictures[0].img,
                        quantity: item.quantity,
                    }
                    cartItems[item.size._id.toString()] = {
                        _id: item.size._id.toString(),
                        size: item.size.size,
                    }
                })
                res.status(200).json({ cartItems });
            }
        })
}

// Xoa 1 san pham trong CartItems
exports.removeCartItems = (req, res) => {
    const { productId } = req.body.payload;
    console.log(productId)
    if (productId) {
        Cart.updateMany({ user: req.user._id },
            {
                $pull: {
                    cartItems: {
                        product: productId
                    }
                }
            }).exec((error, result) => {
                if (error) return res.status(400).json({ error });
                if (result) {
                    res.status(202).json({ result });
                }
            })
    }
}
