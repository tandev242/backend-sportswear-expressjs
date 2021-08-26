const Category = require("../models/category");
const Product = require("../models/product");
const Order = require("../models/order");
const Brand = require("../models/brand");


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
        .select("_id name price quantity slug description productPictures category brand")
        .populate({ path: "category", select: "_id name" })
        .populate({ path: "brand", select: "_id name" })
        .exec();
    const orders = await Order.find({})
        .populate("items.productId", "name")
        .exec();
    res.status(200).json({
        categories: createCategories(categories),
        brands,
        products,
        orders
    })
}