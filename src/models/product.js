const mongoose = require('mongoose');
sizeProductSchema = require('../models/sizeProduct').schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    productPictures: [
        { img: { type: String } }
    ],
    reviews: [
        {
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User',
            },
        },
    ],
    sizes: [sizeProductSchema],
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);