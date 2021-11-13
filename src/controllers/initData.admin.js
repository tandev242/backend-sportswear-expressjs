const Category = require("../models/category");
const Product = require("../models/product");
const Order = require("../models/order");
const Brand = require("../models/brand");
const Size = require("../models/size");
const User = require("../models/user");

const createCategories = (categories, parentId = null) => {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter(c => c.parentId == undefined);
    } else {
        category = categories.filter(c => c.parentId == parentId);
    }
    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            children: createCategories(categories, cate._id),
        });
    }
    return categoryList;
}


exports.initData = async (req, res) => {
    const categories = await Category.find({}).exec();
    const brands = await Brand.find({}).exec();
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
    const orders = await Order.find({})
        .populate("items.productId", "name")
        .populate("items.sizeId", "size")
        .exec();
    const sizes = await Size.find({}).exec();
    const users = await User.find({}).exec();
    res.status(200).json({
        categories: createCategories(categories),
        brands,
        products,
        orders,
        sizes,
        users
    })
}