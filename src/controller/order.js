const Order = require('../models/order');
const Cart = require('../models/cart');
const DeliveryInfo = require("../models/deliveryInfo");
const https = require('https');
const crypto = require('crypto');

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
            type: 'delivered',
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

exports.addOrderByPaymentMomo = (req, res) => {
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
            type: 'delivered',
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
        .populate("items.productId", "_id name slug price discountPercent productPictures")
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

exports.updateOrderStatus = (req, res) => {
    const { orderId, type } = req.body;
    Order.findOneAndUpdate({ _id: orderId, "orderStatus.type": type },
        {
            $set: {
                "orderStatus.$": [
                    { type, date: new Date(), isCompleted: true },
                ],

            },
        }
    ).exec((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) {
            res.status(202).json({ order });
        } else {
            res.status(400).json({ error: "something went wrong" });
        }
    });
}

exports.getCustomerOrders = async (req, res) => {
    const orders = await Order.find({})
        .populate("items.productId", "_id name slug price discountPercent productPictures")
        .exec();
    res.status(200).json({ orders });
};


exports.getOrders = (req, res) => {
    Order.find({ user: req.user._id })
        .select("_id totalAmount paymentStatus paymentType orderStatus items")
        .populate("items.productId", "_id name slug price discountPercent productPictures")
        .populate("items.sizeId", "_id size description")
        .exec((error, orders) => {
            if (error) return res.status(400).json({ error });
            if (orders) {
                res.status(200).json({ orders });
            } else {
                res.status(400).json({ error: "something went wrong" });
            }
        })
}

exports.paymentWithMomo = async (req, res) => {
    const { order } = req.body;
    const partnerCode = "MOMO6K0Y20210317";
    const accessKey = "8oZLaYOOTAswDt0O";
    const secretkey = "MHxk2u6eOXitCarGbCsGXmpydjn0wCAk";
    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const orderInfo = "Thanh toán giày tại DoubleT";
    const redirectUrl = "https://doublet.vercel.app/cart";
    const ipnUrl = "https://webhook.site/21039e28-80b1-4c48-a98e-4d06cdadc16d";
    const amount = order.totalAmount;
    const requestType = "captureWallet"
    const extraData = ""; //pass empty value if your merchant does not have stores
    const rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
    const signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');
    //json object send to MoMo endpoint
    const body = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: 'en'
    });
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    }
    var request = await https.request(options, (resp) => {
        resp.setEncoding('utf8');
        resp.on('data', (body) => {
            res.status(200).json({ url: JSON.parse(body).payUrl });
        });
        resp.on('end', () => {
            console.log('No more data in response.');
        });
    });
    request.write(body);
    request.end();
}