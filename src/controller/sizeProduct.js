const SizeProduct = require("../models/sizeProduct");


exports.addSizeProduct = (req, res) => {
    const { size, quantity, product } = req.body;

    const sizeObj = new SizeProduct({ product, size, quantity });

    sizeObj.save((error, sizeProduct) => {
        if (error) return res.status(400).json({ error });
        if (sizeProduct) {
            res.status(201).json({ sizeProduct });
        }
    })
}

exports.updateQtyBySizeProduct = (req, res) => {
    const { product, size, quantity } = req.body;
    SizeProduct.updateOne({ product, size }, { quantity })
        .exec((err, result) => {
            if (err) return res.status(400).json({ error });
            if (result) {
                res.status(202).json({ result });
            }
        })
}
