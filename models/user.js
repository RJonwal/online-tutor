const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    title: {
        type: String,
        default: '',
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        default: '',
    },
    token: {
        type: String,
        default: ''
    },
    phone: {
        type: Number,
        maxlength: 10,
        default: null
    },
    gender: {
        type: Number,
    },
    address: {
        type: String,
        default: ''
    },
    profile_image: {
        type: String,
        default: ''
    },
    note: {
        type: String,
        default: ''
    },
    role: {
        type: Number,
    },
    status: {
        type: Number,
    },

    /**
     * extra field for student student start
     */
    start_date: {
        type: Date,
        default: ''
    },
    skill_level: {
        type: String,
        default: ''
    },
    birth_day: {
        type: Date,
    },
    referrer: {
        type: String,
        default: ''
    },
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schools',
        default: null
    },

    /**
     * fields for the tutor
     */
    calendar_color: {
        type: String,
        default: ''
    },
    tutor_subject_ids: {
        type: Array,
        default: null
    },

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


const User = mongoose.model('user', userSchema);
module.exports = User;