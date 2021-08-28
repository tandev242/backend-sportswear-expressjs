const Size = require("../models/size");


exports.addSize = (req, res) => {
    const { size, description } = req.body;

    const sizeObj = new Size({ size , description });

    sizeObj.save((error, size) => {
        if (error) return res.status(400).json({ error });
        if (size) {
            res.status(201).json({ size: size });
        }
    })
}

exports.getAllSizes = (req, res) => {
    Size.find({}).exec(async (error, sizes) => {
        if (error) return res.status(400).json({ error });
        if (sizes) {
            res.status(200).json({ sizes });
        }
    })
}

