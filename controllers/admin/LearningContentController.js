const Topic = require('../../models/Topic');
const SubTopic = require('../../models/SubTopic');
const Grade = require('../../models/Grade');
const fs = require('fs');
let session = require('express-session');
var slugify = require('slugify')

const LearningContent = require('../../models/LearningContent');
const Lesson = require('../../models/Lesson');

module.exports = {
    index,
    renderSubtopic,
    create,
    createOld,
    store,
    edit,
    update,
    destroy,
    previewCourses,
    viewCourses,
    singleSelectText,
    singleSelectImage,
    singleSelectWithImage,
    multipleSelectImage,
    multipleSelectWithImage,
    multipleSelectText,
}

/**
 * list learningContent. 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let topics = await Topic.find({}).sort({ '_id': -1 });
        let grades = await Grade.find({}).sort({ '_id': -1 });
        return res.render('../views/admin/learningContent/index', { topics: topics, grades: grades });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * list learningContent. 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function renderSubtopic(req, res) {
    try {
        let subTopics = await SubTopic.find({ topic_id: req.body.id }).sort({ 'name': 1 });
        return res.send(subTopics);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * create content.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        let activeTopics = await Topic.find({ "status": 1 }).sort({ '_id': -1 });
        let activeSubTopics = await SubTopic.find({ "status": 1 }).sort({ '_id': -1 });
        let activeGrades = await Grade.find({ "status": 1 }).sort({ '_id': -1 });
        return res.render('../views/admin/learningContent/create', { topics: activeTopics, grades: activeGrades, subTopics: activeSubTopics });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}


/**
 * store learningContent.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function store(req, res) {
    try {
        var fileNames;
        if (req.files != undefined) {
            fileNames = req.files.map(function (file) {
                return {
                    [file.fieldname]: file.filename,
                };
            });
        }


        let innerList = req.body['outer-list'];
        let i = 0;
        var myLessons = [];
        var slides = [];

        for (lessons of innerList) {
            let j = 0;
            for (content of lessons['inner-list']) {
                var slide = {};
                img = fileNames[i];
                let values = Object.values(img);

                slide = {};
                slide['title'] = content.title;
                slide['duration'] = content.duration;
                slide['description'] = content.description;
                slide['video_url'] = content.video_url;
                // slide['video'] = content.video;
                // slide['attachments'] = content.attachments;

                slides.push(slide);
                j++;
            }

            console.log(slides)
            var myLesson = {
                title: lessons.lesson_name,
                slides: slides,
            };

            let lesson = await Lesson.create(myLesson);
            myLessons.push(lesson._id);
            var slides = [];
            i++;
        }
        console.log(myLessons)

        req.body.thumbnail = fileNames[0].thumbnail;

        var myContent = {
            grade_id: req.body.grade_id,
            topic_id: req.body.topic_id,
            sub_topic_id: req.body.sub_topic_id,
            title: req.body.title,
            short_description: req.body.short_description,
            thumbnail: req.body.thumbnail,
            lesson_ids :myLessons,
        };

        let learningContent = await LearningContent.create(myContent);
        console.log(learningContent);
        if (learningContent) {
            req.flash('success', 'learningContent is Created successfully!');
            res.status(200).json({ "success": true, "message": "learningContent is created successfully!", "redirectUrl": "/learning-content" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}


/**
 * edit learningContent.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function edit(req, res) {

}


/**
 * update learningContent.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function update(req, res) {

}


/**
 * delete learningContent
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function destroy(req, res) {

}


/**
 * preview learningContent.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function previewCourses(req, res) {
    try {
        return res.render('../views/admin/learningContent/previewCourses');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * view learningContent.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function viewCourses(req, res) {
    try {
        return res.render('../views/admin/learningContent/viewCourses');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}


/**
 * signle Select Text
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function singleSelectText(req, res) {
    try {
        return res.render('../views/admin/learningContent/singleSelectText');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * signle Select Image
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function singleSelectImage(req, res) {
    try {
        return res.render('../views/admin/learningContent/singleSelectImage');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * signle Select With Image
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function singleSelectWithImage(req, res) {
    try {
        return res.render('../views/admin/learningContent/singleSelectWithImage');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * Multiple Select Image
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function multipleSelectImage(req, res) {
    try {
        return res.render('../views/admin/learningContent/multipleSelectImage');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * Multiple Select With Image
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function multipleSelectWithImage(req, res) {
    try {
        return res.render('../views/admin/learningContent/multipleSelectWithImage');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * Multiple Select Text
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function multipleSelectText(req, res) {
    try {
        return res.render('../views/admin/learningContent/multipleSelectText');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * Multiple Select Text
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function createOld(req, res) {
    try {
        let activeTopics = await Topic.find({ "status": 1 }).sort({ '_id': -1 });
        let activeSubTopics = await SubTopic.find({ "status": 1 }).sort({ '_id': -1 });
        let activeGrades = await Grade.find({ "status": 1 }).sort({ '_id': -1 });
        return res.render('../views/admin/learningContent/createOld', { topics: activeTopics, grades: activeGrades, subTopics: activeSubTopics });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

