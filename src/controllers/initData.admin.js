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
    const categories = await Category.find({ isDisabled: { $ne: true } })
    const brands = await Brand.find({ isDisabled: { $ne: true } })
    const products = await Product.find({ isDisabled: { $ne: true } })
        .populate({ path: "category", select: "_id name" })
        .populate({ path: "brand", select: "_id name" })
        .populate('sizes')
        .populate({
            path: 'sizes', populate: {
                path: "size", select: "_id size description"
            }
        })
        
    const orders = await Order.find({})
        .populate("items.productId", "name")
        .populate("items.sizeId", "size")
        
    const sizes = await Size.find({})
    const users = await User.find({ isDisabled: { $ne: true } })
    res.status(200).json({
        categories: createCategories(categories),
        brands,
        products,
        orders,
        sizes,
        users
    })
}