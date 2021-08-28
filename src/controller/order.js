const Order = require('../models/order');
const Cart = require('../models/cart');
const DeliveryInfo = require("../models/deliveryInfo");


exports.addOrder = (req, res) => {
    const { items, addressId, totalAmount, paymentStatus, paymentType } = req.body;
    const orderStatus = [
        {
            type: 'ordered',
            date: new Date(),
            isCompleted: true,
        },
        {
            type: 'packed',
            isCompleted: false,
        },
        {
            type: 'shipped',
            isCompleted: false,
        },
        {
            type: 'ordered',
            isCompleted: false,
        },
    ]

    items.map((item) => {
        const productId = item.productId;
        const sizeId = item.sizeId;
        if (productId) {
            Cart.updateOne(
                { user: req.user._id },
                {
                    $pull: {
                        cartItems: {
                            product: productId,
                            size: sizeId
                        },
                    },
                }
            ).exec((error, result) => {
                if (error)
                    return res.status(400).json({ error });
            });
        }
    })

    const order = new Order({
        user: req.user._id,
        addressId,
        totalAmount,
        items,
        paymentStatus,
        paymentType,
        orderStatus
    })
    order.save((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) {
            res.status(201).json({ order });
        }
    });
}


exports.getOrder = (req, res) => {
    const { orderId } = req.body;
    Order.findOne({ _id: orderId })
        .populate("items.productId", "_id name productPictures")
        .populate("items.sizeId", "_id size description")
        .lean()
        .exec((error, order) => {
            if (error) return res.status(400).json({ error });
            if (order) {
                DeliveryInfo.findOne({ user: req.user._id })
                    .exec((error, dI) => {
                        if (error) return res.status(400).json({ error });
                        order.address = dI.address.find(address => address._id == order.addressId);
                        res.status(200).json({ order });
                    })
            }
        })
}


exports.getOrders = (req, res) => {
    Order.find({ user: req.user._id })
        .select("_id totalAmount paymentStatus paymentType orderStatus items")
        .populate("items.productId", "_id name productPictures")
        .populate("items.sizeId", "_id size description")
        .exec((error, orders) => {
            if (error) return res.status(400).json({ error });
            if (orders) {
                res.status(200).json({ orders });
            }
        })
}
