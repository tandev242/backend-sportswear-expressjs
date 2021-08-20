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
    const brand = new Brand(brandObj);
    brand.save((error, brand) => {
        if (brand) {
            return res.status(201).json({ brand });
        }
        return res.status(400).json({ error })
    })
}


exports.getBrands = (req, res) => {
    Brand.find({}).exec((error, brands) => {
        if (error) {
            return res.status(400).json({ error })
        } 
        if(brands) {
            const brandList = createBrands(Brands);
            return res.status(200).json({ brandList });
        }else{
            return res.status(400).json({ error: "something went wrong" });
        }
    })
}