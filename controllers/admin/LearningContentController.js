const Topic = require('../../models/Topic');
const SubTopic = require('../../models/SubTopic');
const Grade = require('../../models/Grade');
const LearningContent = require('../../models/LearningContent');
const Lesson = require('../../models/Lesson');
const globalHelper = require('../../_helper/GlobalHelper');



const fs = require('fs');
let session = require('express-session');
var slugify = require('slugify')

module.exports = {
    index,
    listing,
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
        let topics = await Topic.find({}).sort({ 'name': 1 });
        let grades = await Grade.find({}).sort({ 'name': 1 });


        let learningContents = await LearningContent.find({ "status": 1 }).sort({ '_id': -1 });

        let totalLearningContent = await LearningContent.find({}).sort({ '_id': -1 }).count();
        let activeLearningContent = await LearningContent.find({ "status": 1 }).sort({ '_id': -1 }).count();
        let deactiveLearningContent = await LearningContent.find({ "status": 0 }).sort({ '_id': -1 }).count();
        const learningContentObject = { 'total': totalLearningContent, 'active': activeLearningContent, 'deactive': deactiveLearningContent }


        return res.render('../views/admin/learningContent/index', { topics: topics, grades: grades, learningContentObject: learningContentObject, learningContents: learningContents });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * listing
 * @param {*} req 
 * @param {*} res 
 */
async function listing(req, res) {
    var obj = {};
    var showEntries = req.body.showEntries;
    var offset = parseInt(req.body.offset);
    var currentPage = req.body.currentPage;
    var searchStr = req.body.search;
    if (req.body.grade) {
        obj["grade_id"] = req.body.grade;
    }
    if (req.body.topic) {
        obj["topic_id"] = req.body.topic;
    }
    if (req.body.subTopic) {
        obj["sub_topic_id"] = req.body.subTopic;
    }
    if (req.body.status) {
        obj["status"] = req.body.status;
    }
    if (req.body.search) {
        var regex = new RegExp(req.body.search, "i")
        searchStr = { $or: [{ 'title': regex }] };
    }
    else {
        searchStr = {};
    }
    console.log(obj);
    var recordsTotal = 0;
    var recordsFiltered = 0;
    var totalNoOfPages = 0;

    recordsTotal = await LearningContent.count();
    recordsFiltered = await LearningContent.count({ $and: [obj, searchStr] });
    totalNoOfPages = Math.ceil(recordsFiltered / showEntries);

    console.log(offset,showEntries);
    let results = await LearningContent.find({ $and: [obj, searchStr] }, '_id grade_id topic_id sub_topic_id title slug short_description thumbnail lesson_ids status created_at', { 'skip': Number(offset), 'limit': Number(showEntries) }).populate('grade_id').populate('topic_id').populate('sub_topic_id').populate('lesson_ids');
    //console.log(results);
    // console.log("recordsTotal => " + recordsTotal);
    // console.log("recordsFiltered => " + recordsFiltered);
    // console.log("totalNoOfPages => " + totalNoOfPages);

    // console.log(results);

    var courses = [];
    let course = '';
    for (content of results) {
        let contentStatus = (content.status == 1 ? 'Active' : 'Deactive');
        let statusClass = (content.status == 1 ? 'status-active' : 'status-deactive');
        let lessons_ids = content.lesson_ids;
        let totalSlides = 0;
        let durations = [];
        let courseImage = '';
        let i =0;
        for (lessons of lessons_ids) {
            totalSlides += lessons.slides.length;
            for (slide of lessons.slides) {
                durations[i] = slide.duration;
                i++;
            }
        }
        var totalDuration = globalHelper.calculateDuration(durations);
        // if(content.thumbnail)
        // if (content.thumbnail !='' && fs.existsSync("assets/LearningContent/"+content.title)) { 
            courseImage = "assets/LearningContent/"+content.title+"/"+content.thumbnail;
        // }else{
            courseImage = "/images/course-thumb.jpg";
        // }
        
        course += `<li><div class="course-thumb"><img src="${courseImage}"></div><div class="course-description"><div class="top-dis"><h3 class="title-text">${content.title}</h3><p>${content.short_description}</p></div><div class="course-detail"><div class="detail-col"><p class="p-light">Grade</p><p class="p-dark">${content.grade_id.name}</p></div><div class="detail-col"><p class="p-light">Topic</p><p class="p-dark">${content.topic_id.name}</p></div><div class="detail-col"><p class="p-light">SubTopic</p><p class="p-dark">${content.sub_topic_id.name}</p></div><div class="detail-col"><p class="p-light">Lessons</p><p class="p-dark">${content.lesson_ids.length}</p></div><div class="detail-col"><p class="p-light">Slides</p><p class="p-dark">${totalSlides}</p></div><div class="detail-col"><p class="p-light">Duration</p><p class="p-dark">${totalDuration}</p></div><div class="detail-col"><p class="p-light">Status</p><p class="p-dark"><a class="${statusClass}" href="javascript:void(0);">${contentStatus}</a></p></div></div></div><div class="dropdown"><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><img src="/images/menu-dot.svg" alt="Menu"></button><div class="dropdown-menu dropdown-menu-right"><a href="javascript:void(0);">View</a><a href="javascript:void(0);">Edit</a><a class="text-danger" href="javascript:void(0);">Delete</a></div></div></li>`;

        totalSlides = 0;
        totalDuration = 0;
    }

    var data = JSON.stringify({
        "recordsTotal": recordsTotal,
        "recordsFiltered": recordsFiltered,
        "totalNoOfPages": totalNoOfPages,
        "currentPage": currentPage,
        "courses": course,
        "result":results.length,
    });

    return res.send(data);
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
        let index = 0;
        for (lessons of innerList) {
            let j = 0;
            for (content of lessons['inner-list']) {
                var slide = {};
                // img = fileNames[j];
                // let values = Object.values(img);
                var video ='';
                var attachment='';
                for(files of fileNames){
                    let keys = Object.keys(files);
                    let values = Object.values(files);
                    if(keys == `outer-list[${i}][inner-list][${j}][slide_video]`){
                        video = values[0];
                    }
                    if(keys == `outer-list[${i}][inner-list][${j}][slide_attachments]`){
                        attachment = values;
                    }
                }
                //console.log(video[0],attachment);
                slide = {};
                slide['title'] = content.slide_title;
                slide['duration'] = content.slide_duration;
                slide['description'] = content.slide_description; // ??
                slide['video_url'] = content.slide_video_url;
                slide['video'] = video;
                slide['attachments'] = attachment;

                slides.push(slide);
                j++;
            }
            var myLesson = {
                title: lessons.lesson_name,
                slides: slides,
            };
            let lesson = await Lesson.create(myLesson);
            myLessons.push(lesson._id);
            var slides = [];
            i++;
        }
        req.body.thumbnail = fileNames[0].thumbnail;

        var myContent = {
            grade_id: req.body.grade_id,
            topic_id: req.body.topic_id,
            sub_topic_id: req.body.sub_topic_id,
            title: req.body.title,
            short_description: req.body.short_description,
            thumbnail: req.body.thumbnail,
            lesson_ids: myLessons,
        };

        let learningContent = await LearningContent.create(myContent);
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

