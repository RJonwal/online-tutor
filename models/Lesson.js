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

// var slideSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         default: null
//     },
//     duration: {
//         type: Number,
//         default: null
//     },
//     description: {
//         type: String,
//         default: null
//     },
//     video_url: {
//         type: String,
//         default: null
//     },
//     video: {
//         type: String,
//         default: null
//     },
//     attachments: {
//         type: Array,
//         default: null,
//     }
// }); 

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        // unique: true,
        required: true,
    },
    slug: {
        type: String,
        // unique: true,
    },
    slides: [{
        title: {
            type: String,
            default: null
        },
        duration: {
            type: String,
            default: null
        },
        description: {
            type: String,
            default: null
        },
        video_url: {
            type: String,
            default: null
        },
        video: {
            type: String,
            default: null
        },
        attachments: {
            type: Array,
            default: null,
        }
    }],
    practices: [{
        question_type: {
            type: String,
            default: null
        },
        question_title: {
            type: String,
            default: null
        },
        question_duration: {
            type: String,
            default: null
        },
        question_description: {
            type: String,
            default: null
        },
        question_image: {
            type: String,
            default: null
        },
        option_display_preference: {
            type: String,
            default: null
        },
        options: [{
            option_image: {
                type: String,
                default: null
            },
            option_text: {
                type: String,
                default: null
            },
            option_explanation: {
                type: String,
                default: null
            },
            option_correct: {
                type: Boolean,
                default: false
            }
        }],
    }],
    deleted_at: {
        type: Date,
        default: null
    }
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });

lessonSchema.pre("save", function (next) {
    this.slug = slugify(this.title, slugify_options);
    next();
});

lessonSchema.pre('update,updateOne,findByIdAndUpdate,findOneAndUpdate', function (next) {
    this._update.slug = slugify(this.name, slugify_options);
    next();
});

const Lesson = mongoose.model('lessons', lessonSchema);
module.exports = Lesson;