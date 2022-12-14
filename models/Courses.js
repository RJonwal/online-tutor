const mongoose = require('mongoose');
var slugify = require('slugify')

const slugify_options = {
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true,      // convert to lower case, defaults to `false`
    strict: false,     // strip special characters except replacement, defaults to `false`
    locale: 'en',       // language code of the locale to use
    trim: true         // trim leading and trailing replacement chars, defaults to `true`
}


const coursesSchema = new mongoose.Schema({
    subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true,
    },
    grade_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'grade',
        required: true,
    },
    title: {
        type: String,
        unique: true,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    short_description: {
        type: String,
        default: ''
    },
    cover_image: {
        type: String,
        default: ''
    },
    thumbnail: {
        type: String,
        default: ''
    },
    sections: {
        type: ObjectId,
        ref: 'sections',
        required: true,
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


coursesSchema.pre("save", function (next) {
    this.slug = slugify(this.name, slugify_options);
    next();
});


coursesSchema.pre('update,updateOne,findByIdAndUpdate,findOneAndUpdate', function (next) {
    this._update.slug = slugify(this.name, slugify_options);
    next();
});


const Course = mongoose.model('courses', coursesSchema);
module.exports = Category;