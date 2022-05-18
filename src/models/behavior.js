const mongoose = require('mongoose')

const behaviorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        require: true
    },
    view: {
        type: Number,
        required: true,
        default: 0
    },
    buy: {
        type: Number,
        required: true,
        default: 0
    },
    addToCart: {
        type: Number,
        required: true,
        default: 0
    },
    rate: {
        type: Number,
        required: true,
        default: 0
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
},
    { timestamps: true }
)

module.exports = mongoose.model("Behavior", behaviorSchema)
