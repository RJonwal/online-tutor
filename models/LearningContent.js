const mongoose = require('mongoose');
var slugify = require('slugify')

const slugify_options = {
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true,       // convert to lower case, defaults to `false`
    strict: false,     // strip special characters except replacement, defaults to `false`
    locale: 'en',      // language code of the locale to use
    trim: true         // trim leading and trailing replacement chars, defaults to `true`
}

const learningContentSchema = new mongoose.Schema({
    grade_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'grades',
        required: true,
    },
    topic_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'topics',
        required: true,
    },
    sub_topic_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subTopics',
        default: null,   
        transform: sub_topic_id => sub_topic_id == null ? '' : sub_topic_id
    },
    title: {
        type: String,
        // unique: true,
        required: true,
    },
    slug: {
        type: String,
        // unique: true,
    },
    short_description: {
        type: String,
        default: null,
    },
    thumbnail: {
        type: String,
        default: null,
        transform: thumbnail => thumbnail == null ? '' : thumbnail
    },
    lesson_ids: [{
        type: 'ObjectId',
        ref: 'lessons',
        default: null
    }],
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


learningContentSchema.pre("save", function (next) {
    this.slug = slugify(this.title, slugify_options);
    next();
});


learningContentSchema.pre('update,updateOne,findByIdAndUpdate,findOneAndUpdate', function (next) {
    this._update.slug = slugify(this.name, slugify_options);
    next();
});


const LearningContent = mongoose.model('learningContents', learningContentSchema);
module.exports = LearningContent;