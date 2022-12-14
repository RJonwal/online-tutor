const mongoose = require('mongoose');
const gradeSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    status: {
        type: Number,
        default: ''
    },
    deleted_at: {
        type: Date,
        default: null
    }
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });
const Grade = mongoose.model('grades', gradeSchema);
module.exports = Grade;