const mongoose = require('mongoose');
const schoolsSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        default: ''
    },
    dial_code: {
        type: Number,
        // minlength: 1,
        maxlength: 5,
        default: null
    },
    iso_code: {
        type: String,
        // minlength: 1,
        maxlength: 5,
        default: null
    },
    phone: {
        type: Number,
        // minlength: 5,
        maxlength: 15,
        default: null
    },
    address: {
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
const School = mongoose.model('schools', schoolsSchema);
module.exports = School;