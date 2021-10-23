const DeliveryInfo = require("../models/deliveryInfo");

exports.addDeliveryInfo = (req, res) => {

    const { address } = req.body;
    if (address) {
        if (address._id) {
            DeliveryInfo.findOneAndUpdate({ user: req.user._id, "address._id": address._id },
                {
                    $set: {
                        "address.$": address
                    }
                }).exec((error, address) => {
                    if (error) return res.status(400).json({ error });
                    if (address) {
                        res.status(201).json({ address });
                    } else {
                        res.status(400).json({ error: "something went wrong" })
                    }
                })
        } else {
            DeliveryInfo.findOneAndUpdate(
                { user: req.user._id },
                {
                    $push: {
                        address,
                    },
                },
                { new: true, upsert: true }
            ).exec((error, address) => {
                if (error) return res.status(400).json({ error });
                if (address) {
                    res.status(201).json({ address });
                } else {
                    res.status(400).json({ error: "something went wrong" })
                }
            });
        }
    } else {
        res.status(400).json({ error: "Params address required" });
    }
}


exports.deleteDeliveryInfo = (req, res) => {
    const { addressId } = req.body.payload;
    if (addressId) {
        DeliveryInfo.findOneAndUpdate({ user: req.user._id },
            {
                $pull: {
                    address: {
                        _id: addressId,
                    }
                }
            }).exec((error, result) => {
                if (error) return res.status(400).json({ error });
                if (result) {
                    res.status(202).json({ result });
                } else {
                    res.status(400).json({ error: "something went wrong" })
                }
            })
    } else {
        res.status(400).json({ error: "Params address required" });
    }
}

exports.setDefaultDeliveryInfo = (req, res) => {
    const { addressId } = req.body.payload;
    if (addressId) {
        DeliveryInfo.updateOne({ user: req.user._id },
            {
                $set: {
                    "address.$[].isDefault": false
                }
            }).exec((done, error) => {
                DeliveryInfo.findOneAndUpdate({ user: req.user._id, "address._id": addressId },
                    {
                        $set: {
                            "address.$.isDefault": true
                        }
                    }).exec((error, result) => {
                        if (error) return res.status(400).json({ error });
                        if (result) {
                            res.status(201).json({ result: "Set Default successful" });
                        } else {
                            res.status(400).json({ error: "something went wrong" })
                        }
                    })
            })
    } else {
        res.status(400).json({ error: "Params address required" });
    }
}

exports.getDeliveryInfo = (req, res) => {
    DeliveryInfo.findOne({ user: req.user._id })
        .populate("user", "_id name profilePicture")
        .exec((error, deliveryInfo) => {
            if (error) return res.status(400).json({ error });
            if (deliveryInfo) {
                res.status(200).json({ deliveryInfo });
            } else {
                res.status(200).json({ deliveryInfo: {} });
            }
        })
}