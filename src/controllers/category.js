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

    if (req.file) {
        categoryObj.categoryImage = req.file.path;
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

exports.deleteCategories = async (req, res) => {
    const { ids } = req.body.payload;
    const deletedCategories = [];
    for (let i = 0; i < ids.length; i++) {
        const deleteCategory = await Category.findOneAndDelete({
            _id: ids[i]._id
        });
        deletedCategories.push(deleteCategory);
    }

    if (deletedCategories.length == ids.length) {
        res.status(201).json({ message: "Categories removed" });
    } else {
        res.status(400).json({ message: "Something went wrong" });
    }
};


exports.updateCategories = async (req, res) => {
    const { _id, name, parentId } = req.body;
    if (name instanceof Array) {
        for (let i = 0; i < name.length; i++) {
            const category = {
                name: name[i]
            }
            if (parentId !== "") {
                category.parentId = parentId;
            }
            await Category.findOneAndUpdate({ _id: _id[i] }, category,
                { new: true }
            );
        }
        res.status(202).json({ message: 'Category updated successfully' })
    } else {
        const category = {
            name,
        };
        if (parentId !== "") {
            category.parentId = parentId;
        }
        await Category.findOneAndUpdate({ _id }, category, {
            new: true,
        });
        res.status(202).json({ message: 'Category updated successfully' })
    }
};
