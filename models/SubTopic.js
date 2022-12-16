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


const subTopicsSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    topic_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'topics',
        required: true,
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


subTopicsSchema.pre("save", function (next) {
    this.slug = slugify(this.name, slugify_options);
    next();
});


subTopicsSchema.pre('update,updateOne,updateMany,findByIdAndUpdate,findOneAndUpdate', function (next) {
    this.update.slug = slugify(this.name, slugify_options);
    next();
});


const SubCategory = mongoose.model('subTopics', subTopicsSchema);
module.exports = SubCategory;