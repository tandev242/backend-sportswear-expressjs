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
    discountPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
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
            createdAt: { type: Date, default: Date.now }
        },
    ],
    sizes: [sizeProductSchema],
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    isDisabled: false
}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);