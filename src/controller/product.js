const Product = require("../models/product");
const Category = require("../models/category");
const shortid = require("shortid");
const slugify = require("slugify");


exports.addProduct = (req, res) => {
    const { name, price, description, category, brand } = req.body;
    const sizes = JSON.parse(req.body.sizes);
    let productPictures = [];

    if (req.files.length > 0) {
        productPictures = req.files.map((file) => {
            return { img: file.filename };
        });
    }

    const product = new Product({
        name: name,
        slug: `${slugify(name)}-${shortid.generate()}`,
        price,
        description,
        productPictures,
        sizes,
        category,
        brand
    });
    product.save((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) {
            res.status(201).json({ product, files: req.files });
        }
    });
}

exports.updateProduct = (req, res) => {
    Product.findByIdAndUpdate(
        { _id: req.body._id }),
        { $set: req.body },
        (error, result) => {
            if (err) return res.status(400).json({ error });
            res.status(202).json({ result });
        }
}

exports.updateQty = (req, res) => {
    const { productId, sizeProductId, quantity } = req.body;
    Product.findOne({ _id: productId })
        .exec((error, product) => {
            if (error) return res.status(400).json({ error });
            const sizeMatch = product.sizes.find(sizeProduct => sizeProduct._id == sizeProductId);
            if (sizeMatch) {
                sizeMatch.quantity = quantity;
                product.save((error, product) => {
                    if (error) return res.status(400).json({ error });
                    if (product) {
                        res.status(202).json({ product });
                    }
                })
            }
        })
}

exports.updateSizes = (req, res) => {
    const { productId, sizes } = req.body;
    Product.updateOne(
        { _id: productId },
        { sizes })
        .exec(
            (error, result) => {
                if (error) return res.status(400).json({ error });
                res.status(202).json({ result });
            })
}


exports.getProductsBySlug = (req, res) => {
    const { slug, type } = req.params;
    if (type === "category") {
        Category.findOne({ slug }).exec((error, category) => {
            if (error) return res.status(400).json({ error });
            if (category) {
                Product.find({ category: category._id })
                    .populate({ path: "category", select: "_id name" })
                    .populate({ path: "brand", select: "_id name" })
                    .populate('sizes')
                    .populate({
                        path: 'sizes', populate: {
                            path: "size", select: "_id size description"
                        }
                    })
                    .exec((error, products) => {
                        if (error) return res.status(400).json({ error });
                        if (products) {
                            res.status(200).json({ products: products })
                        }
                    })
            }
        })
    }
    else if (type === 'brand') {
        Brand.findOne({ slug }).exec((error, brand) => {
            if (error) return res.status(400).json({ error });
            if (brand) {
                Product.find({ category: category._id })
                    .populate({ path: "category", select: "_id name" })
                    .populate({ path: "brand", select: "_id name" })
                    .populate('sizes')
                    .populate({
                        path: 'sizes', populate: {
                            path: "size", select: "_id size description"
                        }
                    })
                    .exec((error, products) => {
                        if (error) return res.status(400).json({ error });
                        if (products) {
                            res.status(200).json({ products: products })
                        }
                    })
            }
        })
    }
    else {
        return res.status(400).json({ error: "Params required" });
    }
}

exports.getProductById = (req, res) => {
    const { id } = req.params;
    if (id) {
        Product.findOne({ _id: id })
            .populate({ path: "category", select: "_id name" })
            .populate({ path: "brand", select: "_id name" })
            .populate('sizes')
            .populate({
                path: 'sizes', populate: {
                    path: "size", select: "_id size description"
                }
            })
            .exec((error, product) => {
                if (error) return res.status(400).json({ error });
                if (product) {
                    res.status(200).json({ product });
                }
            })
    } else {
        res.status(400).json({ error: "Params required" });
    }
}

exports.deleteProductById = (req, res) => {
    const { productId } = req.body.payload;
    if (productId) {
        Product.deleteOne({ _id: productId })
            .exec((error, result) => {
                if (error) return res.status(400).json({ error });
                if (result) {
                    res.status(202).json({ result });
                }
            })
    } else {
        return res.status(400).json({ error: "Params required" });
    }
}

exports.getProducts = async (req, res) => {
    const products = await Product.find({})
        .populate({ path: "category", select: "_id name" })
        .populate({ path: "brand", select: "_id name" })
        .populate('sizes')
        .populate({
            path: 'sizes', populate: {
                path: "size", select: "_id size description"
            }
        })
        .exec();
    res.status(200).json({ products });
}