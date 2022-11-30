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


const subCategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    // category_id: {
    //     type: String,
    //     required: true,
    // },
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


subCategoriesSchema.pre("save", function (next) {
    this.slug = slugify(this.name, slugify_options);
    next();
});

subCategoriesSchema.pre('update,updateOne,findByIdAndUpdate,findOneAndUpdate', function (next) {
    this._update.slug = slugify(this.name, slugify_options);
    next();
});


const SubCategory = mongoose.model('subCategories', subCategoriesSchema);
module.exports = SubCategory;