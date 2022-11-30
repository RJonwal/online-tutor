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
    phone: {
        type: Number,
        unique: true,
        default: ''
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