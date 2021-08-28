const mongoose = require('mongoose');


const sizeSchema = new mongoose.Schema({
    size: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Size', required: true
    },
    quantity: {
        type: Number,
        required: true,
    }   
}, { timestamps: true }
)
module.exports = mongoose.model("SizeProduct", sizeSchema);