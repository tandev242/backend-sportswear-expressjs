const express = require('express');
const Brand = require('../models/brand');
const slugify = require("slugify");
const shortid = require("shortid");

exports.addBrand = (req, res) => {
    const { name } = req.body;
    const brandObj = {
        name,
        slug: `${slugify(name)}-${shortid.generate()}`
    }
    if (req.file) {
        brandObj.brandImage = req.file.path;
    }

    const brand = new Brand(brandObj);
    brand.save((error, brand) => {
        if (brand) {
            return res.status(201).json({ brand });
        }
        return res.status(400).json({ error })
    })
}

exports.deleteBrands = async (req, res) => {
    const { ids } = req.body.payload;
    const deletedBrands = [];
    for (let i = 0; i < ids.length; i++) {
        const brand = await Brand.findOneAndDelete({
            _id: ids[i]._id
        });
        deletedBrands.push(brand);
    }

    if (deletedBrands.length == ids.length) {
        res.status(201).json({ message: "Brands removed" });
    } else {
        res.status(400).json({ message: "Something went wrong" });
    }
};

exports.updateBrands = async (req, res) => {
    const { brands } = req.body;
    var count = 0;
    for (let i = 0; i < brands.length; i++) {
        await Brand.findOneAndUpdate({
            _id: brands[i]._id
        },
            { name: brands[i].name }
        );
        count++
    }
    if (count == brands.length) {
        res.status(202).json({ message: "Brands updated" });
    } else {
        res.status(400).json({ message: "Something went wrong" });
    }
}

exports.getBrands = (req, res) => {
    Brand.find({}).exec((error, brands) => {
        if (error) {
            return res.status(400).json({ error })
        }
        if (brands) {
            res.status(200).json({ brands });
        } else {
            res.status(400).json({ error: "something went wrong" });
        }
    })
}