const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    size: {
        required: true,
        type: String,
        unique: true
    },
    description: {
        required: true,
        type: String,
    }
});

module.exports = mongoose.model("Size", sizeSchema);