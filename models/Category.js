const mongoose = require('mongoose');
const categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    category_image: {
        type: String,
        default: ''
    },
    note: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 1
    },
    deleted_at: {
        type: Date,
        default: null
    }
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });
const Category = mongoose.model('categories', categoriesSchema);
module.exports = Category;