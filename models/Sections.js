const mongoose = require('mongoose');


const sectionsSchema = new mongoose.Schema({
    lesson: {
        type: Array,
        required: true,
    },
    practice: {
        type: Array,
        required: true,
    },
    challenge: {
        type: Array,
        required: true,
    },
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });


sectionsSchema.pre("save", function (next) {
    this.slug = slugify(this.name, slugify_options);
    next();
});


sectionsSchema.pre('update,updateOne,findByIdAndUpdate,findOneAndUpdate', function (next) {
    this._update.slug = slugify(this.name, slugify_options);
    next();
});


const section = mongoose.model('sections', sectionsSchema);
module.exports = Category;