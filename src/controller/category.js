const Category = require('../models/category');
const slugify = require("slugify");
const shortid = require("shortid");

// Tao ra danh sach category noi duoi nhau de parse qua kieu JSON khi getCategories
const createCategories = (categories, parentId = null) => {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter((cat) => cat.parentId == undefined)
    } else {
        category = categories.filter((cat) => cat.parentId == parentId)
    }

    for (let cat of category) {
        categoryList.push({
            _id: cat._id,
            name: cat.name,
            slug: cat.slug,
            parentId: cat.parentId,
            children: createCategories(categories, cat._id)
        })
    }
    return categoryList;
}

exports.addCategory = (req, res) => {

    const { name, parentId } = req.body;
    const categoryObj = {
        name,
        slug: `${slugify(name)}-${shortid.generate()}`
    }
    if (parentId) {
        categoryObj.parentId = parentId;
    }

    const cate = new Category(categoryObj);
    cate.save((error, category) => {
        if (error) {
            return res.status(400).json({ error })
        }
        if (category) {
            return res.status(201).json({ category });
        }
    })
}


exports.getCategories = (req, res) => {
    Category.find({}).exec((error, categories) => {
        if (error) {
            return res.status(400).json({ error })
        } else {
            const categoryList = createCategories(categories);
            return res.status(200).json({ categoryList });
        }
    })
}

// exports.deleteCategories = (req, res) =>{
//     const { _id } = req.body;
//     Category.findOne({_id}).exec((error, category) =>{
//         if(error) return res.status(400).json({ error });
//         const categories = [];

//     })
// }