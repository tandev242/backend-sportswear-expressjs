const Product = require("../models/product");
const Category = require("../models/category");
const shortid = require("shortid");
const slugify = require("slugify");


exports.addProduct = (req, res) => {
    const { name, price, quantity, description, category, brand } = req.body;
    let productPictures = [];

    if (req.files.length > 0) {
        productPictures = req.files.map((file) => {
            return { img: file.filename };
        });
    }
    console.log(productPictures.length);
    const product = new Product({
        name: name,
        slug: `${slugify(name)}-${shortid.generate()}`,
        price,
        quantity,
        description,
        productPictures,
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

exports.getProductsBySlug = (req, res) => {
    const { slug, type } = req.params;
    console.log(req.params);
    if (type === "category") {
        Category.findOne({ slug }).exec((error, category) => {
            if (error) return res.status(400).json({ error });
            if (category) {
                Product.find({ category: category._id })
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
    console.log(req.body.payload);
    const { id } = req.body.payload;
    console.log(id);
    if (id) {
        Product.deleteOne({ _id: id })
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
    const products = await Product.find({}).select("_id name price quantity slug description productPictures category brand")
        .populate({ path: "category", select: "_id name" })
        .populate({ path: "brand", select: "_id name" })
        .exec();
    res.status(200).json({ products });
}