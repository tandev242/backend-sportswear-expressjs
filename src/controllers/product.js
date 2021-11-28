const Product = require("../models/product");
const Category = require("../models/category");
const Brand = require("../models/brand");
const shortid = require("shortid");
const slugify = require("slugify");


exports.addProduct = (req, res) => {
    const { name, price, description, category, brand, discountPercent } = req.body;
    const sizes = JSON.parse(req.body.sizes);
    let productPictures = [];

    if (req.files.length > 0) {
        productPictures = req.files.map((file) => {
            return { img: file.path };
        });
    }

    const product = new Product({
        name: name,
        slug: `${slugify(name)}-${shortid.generate()}`,
        price,
        description,
        productPictures,
        sizes,
        discountPercent,
        category,
        brand
    });
    product.save((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) {
            res.status(201).json({ product, files: req.files });
        } else {
            res.status(400).json({ error: "something went wrong" });
        }
    });
}

exports.updateProduct = (req, res) => {
    // Product.findByIdAndUpdate(
    //     { _id: req.body._id }),
    //     { $set: req.body },
    //     (error, result) => {
    //         if (error) return res.status(400).json({ error });
    //         res.status(202).json({ result });
    //     }
}

exports.updateDiscountPercent = (req, res) => {
    const { type, _id, discountPercent } = req.body;
    if (type === "category") {
        Product.updateMany({ category: _id }, { $set: { discountPercent } }
        ).exec((error, result) => {
            if (error) return res.status(400).json({ error });
            res.status(202).json({ result });
        })
    } else if (type === "brand") {
        Product.updateMany({ brand: _id }, { $set: { discountPercent } }
        ).exec((error, result) => {
            if (error) return res.status(400).json({ error });
            res.status(202).json({ result });
        })
    } else if (!type) {
        Product.updateOne({ _id }, { $set: { discountPercent } }
        ).exec((error, result) => {
            if (error) return res.status(400).json({ error });
            res.status(202).json({ result });
        })
    } else {
        res.status(400).json({ error: "params is invalid" });
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
                    } else {
                        res.status(400).json({ error: "something went wrong" });
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
    if ((type === "category" || type === "brand") && slug === "all") {
        Product.find({})
            .populate({ path: "category", select: "_id name categoryImage" })
            .populate({ path: "brand", select: "_id name brandImage" })
            .populate('sizes')
            .populate({
                path: 'sizes', populate: {
                    path: "size", select: "_id size description"
                }
            })
            .exec((error, products) => {
                if (error) return res.status(400).json({ error });
                if (products) {
                    res.status(200).json({ products: products, title: "Tất cả sản phẩm" })
                } else {
                    res.status(400).json({ error: "something went wrong" });
                }
            })
    }
    else if (type === "category") {
        Category.findOne({ slug }).exec((error, category) => {
            if (error) return res.status(400).json({ error });
            if (category) {
                // Product.find({ $or: [{ parentId: category._id }, { category: category._id }] })
                const categoriesArr = [category];
                Category.find({ parentId: category._id })
                    .exec((error, categories) => {
                        if (error) {
                            return res.status(400).json({ error: "something went wrong" });
                        }
                        if (categories) {
                            categoriesArr.push(...categories);
                        }
                        Product.find({ category: { $in: categoriesArr } })
                            .populate({ path: "category", select: "_id name categoryImage" })
                            .populate({ path: "brand", select: "_id name brandImage" })
                            .populate('sizes')
                            .populate({
                                path: 'sizes', populate: {
                                    path: "size", select: "_id size description"
                                }
                            })
                            .exec((error, products) => {
                                if (error) return res.status(400).json({ error });
                                if (products) {
                                    res.status(200).json({ products: products, title: category.name })
                                } else {
                                    res.status(400).json({ error: "something went wrong" });
                                }
                            })
                    })
            } else {
                res.status(400).json({ error: "something went wrong" });
            }
        })
    }
    else if (type === 'brand') {
        Brand.findOne({ slug }).exec((error, brand) => {
            if (error) return res.status(400).json({ error });
            if (brand) {
                Product.find({ brand: brand._id })
                    .populate({ path: "category", select: "_id name categoryImage" })
                    .populate({ path: "brand", select: "_id name brandImage" })
                    .populate('sizes')
                    .populate({
                        path: 'sizes', populate: {
                            path: "size", select: "_id size description"
                        }
                    })
                    .exec((error, products) => {
                        if (error) return res.status(400).json({ error });
                        if (products) {
                            res.status(200).json({ products: products, title: brand.name })
                        } else {
                            res.status(400).json({ error: "something went wrong" });
                        }
                    })
            } else {
                res.status(400).json({ error: "something went wrong" });
            }
        })
    }
    else {
        return res.status(400).json({ error: "Params required" });
    }
}

exports.getProductById = (req, res) => {
    const { _id } = req.body;
    if (_id) {
        Product.findOne({ _id })
            .populate({ path: "category", select: "_id name categoryImage" })
            .populate({ path: "brand", select: "_id name brandImage" })
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
                } else {
                    res.status(400).json({ error: "something went wrong" });
                }
            })
    } else {
        res.status(400).json({ error: "Params required" });
    }
}

exports.getProductDetailsBySlug = (req, res) => {
    const { slug } = req.params;
    if (slug) {
        Product.findOne({ slug })
            .populate({ path: "category", select: "_id name categoryImage" })
            .populate({ path: "brand", select: "_id name brandImage" })
            .populate('sizes')
            .populate({
                path: 'sizes', populate: {
                    path: "size", select: "_id size description"
                }
            })
            .populate('reviews')
            .populate({
                path: 'reviews', populate: {
                    path: "user", select: "_id name profilePicture"
                }
            })
            .exec((error, product) => {
                if (error) return res.status(400).json({ error });
                if (product) {
                    res.status(200).json({ product });
                } else {
                    res.status(400).json({ error: "something went wrong" });
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
                } else {
                    res.status(400).json({ error: "something went wrong" });
                }
            })
    } else {
        return res.status(400).json({ error: "Params required" });
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate({ path: "category", select: "_id name categoryImage" })
            .populate({ path: "brand", select: "_id name brandImage" })
            .populate('sizes')
            .populate({
                path: 'sizes', populate: {
                    path: "size", select: "_id size description"
                }
            })
            .populate('reviews')
            .populate({
                path: 'reviews', populate: {
                    path: "user", select: "_id name profilePicture"
                }
            })
            .exec()

        if (products) {
            res.status(200).json({ products });
        } else {
            res.status(400).json({ error: "something went wrong" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
}

exports.searchByProductName = async (req, res) => {
    const { text } = req.body;
    const products = await Product.find({ $text: { $search: text } })
        .populate({ path: "category", select: "_id name categoryImage" })
        .populate({ path: "brand", select: "_id name brandImage" })
        .populate('sizes')
        .populate({
            path: 'sizes', populate: {
                path: "size", select: "_id size description"
            }
        })
        .exec();
    res.status(200).json({ products, title: `Kết quả tìm kiếm: ${text}` });
}

exports.addProductReview = (req, res) => {
    const { rating, comment, productId } = req.body;
    Product.findOneAndUpdate({ _id: productId, "reviews.user": { $ne: req.user._id } },
        {
            $push: {
                "reviews": [
                    { rating, comment, user: req.user._id },
                ],

            },
        }
    ).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
            res.status(202).json({ message: "update successfully" });
        } else {
            res.status(400).json({ error: "something went wrong" });
        }
    });
}