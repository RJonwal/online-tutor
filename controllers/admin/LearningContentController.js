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
    renderSlickSlider,
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
    var recordsTotal = 0;
    var recordsFiltered = 0;
    var totalNoOfPages = 0;

    recordsTotal = await LearningContent.count();
    recordsFiltered = await LearningContent.count({ $and: [obj, searchStr] });
    totalNoOfPages = Math.ceil(recordsFiltered / showEntries);

    let results = await LearningContent.find({ $and: [obj, searchStr] }, '_id grade_id topic_id sub_topic_id title slug short_description thumbnail lesson_ids status created_at', { 'skip': Number(offset), 'limit': Number(showEntries) }).populate('grade_id').populate('topic_id').populate('sub_topic_id').populate('lesson_ids').sort({ created_at: -1 });
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
        let i = 0;
        for (lessons of lessons_ids) {
            totalSlides += lessons.slides.length;
            for (slide of lessons.slides) {
                durations[i] = slide.duration;
                i++;
            }
        }
        var totalDuration = globalHelper.calculateDuration(durations);

        if (content.thumbnail === '' || content.thumbnail === undefined || content.thumbnail === "undefined") {
            courseImage = "/images/course-thumb.jpg";
        } else {
            // if ((content.thumbnail !== '' || content.thumbnail !== "undefined") && fs.existsSync("assets/LearningContent/")) {
            // courseImage = "/LearningContent/" + content.thumbnail;
            // }
            courseImage = "/LearningContent/" + content.thumbnail;
        }

        if (content.sub_topic_id) {
            subTopicName = content.sub_topic_id.name
        } else {
            subTopicName = "None";
        }

        course += `<li><div class="course-thumb"><img src="${courseImage}"></div><div class="course-description"><div class="top-dis"><h3 class="title-text">${content.title}</h3><p>${content.short_description}</p></div><div class="course-detail"><div class="detail-col"><p class="p-light">Grade</p><p class="p-dark">${content.grade_id.name}</p></div><div class="detail-col"><p class="p-light">Topic</p><p class="p-dark">${content.topic_id.name}</p></div>`
        if (subTopicName != 'None') {
            course += `<div class="detail-col"><p class="p-light">SubTopic</p><p class="p-dark">${subTopicName}</p></div>`
        }

        course += `<div class="detail-col"><p class="p-light">Lessons</p><p class="p-dark">${content.lesson_ids.length}</p></div><div class="detail-col"><p class="p-light">Slides</p><p class="p-dark">${totalSlides}</p></div><div class="detail-col"><p class="p-light">Duration</p><p class="p-dark">${totalDuration}</p></div><div class="detail-col"><p class="p-light">Status</p><p class="p-dark"><a class="${statusClass}" href="javascript:void(0);">${contentStatus}</a></p></div></div></div><div class="dropdown"><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><img src="/images/menu-dot.svg" alt="Menu"></button><div class="dropdown-menu dropdown-menu-right"><a href="/learning-content/viewCourses/${content.id}">View</a><a href="javascript:void(0);">Edit</a><a class="text-danger" href="javascript:void(0);"  onclick="confirmBeforeDeletion('/learning-content/destroy/${content._id}')">Delete</a></div></div></li>`;
        totalSlides = 0;
        totalDuration = 0;
    }

    var data = JSON.stringify({
        "recordsTotal": recordsTotal,
        "recordsFiltered": recordsFiltered,
        "totalNoOfPages": totalNoOfPages,
        "currentPage": currentPage,
        "courses": course,
        "result": results.length,
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
 * slick slider content render. 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function renderSlickSlider(req, res) {
    try {
        let lessionId = req.body.id;
        let lessionDetails = await Lesson.find({ "_id": lessionId });
        let html = '';
        for (slides of lessionDetails[0].slides) {
            if (slides.video_url == '') {
                classes = 'col-md-12';
            } else {
                classes = 'col-md-7';
            }
            html += ` 
      <div class="item">
            <div class="row">
                <div class="slide-duration">
                    <h3 class="title-text mb-0">Total Duration </h3>
                    <span class="the-timer"><i class="fa fa-clock-o"></i> ${slides.duration} hrs</span>
                </div>
            </div>
          <div class="row">
            <div class="col-sm-12 ${classes}">
              <h3>${slides.title}</h3>
              ${slides.description}`
            if (slides.attachments != '') {
                html += `<div class="attachment-block">
                  <div class="col-sm-12 col-md-4">
                    <h3 class="title-text mb-3">Attachment</h3>
                    <a class="attch-items" href="/LearningContent/${slides.attachments}" target="_blank">View PDF</a>
                  </div>
              </div>`
            } if (slides.video_url != '') {
                html += `<div class="attachment-block video">
                  <div class="col-sm-12 col-md-4">
                    <h3 class="title-text mb-3">Video </h3>
                    <a class="attch-items" href="${slides.video_url}" target="_blank">Video Url</a>
                  </div>
              </div>`
            }
            html += `</div>`
            if (slides.video) {
                html += `<div class="col-sm-12 col-md-5">
              <div class="preview-thumb">
                <video width="320" height="240" loop autoplay muted controls>
                  <source src="/LearningContent/${slides.video}" type="video/mp4">
              </div>
            </div>`
            }
            html += `</div>
        </div>`;
        }
        return res.send(html);
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
        // get all the files.
        var fileNames;
        if (req.files != undefined) {
            fileNames = req.files.map(function (file) {
                return {
                    [file.fieldname]: file.filename,
                };
            });
        }

        // console.log(req.body);

        let innerList = req.body['outer-list'];

        let i = 0;
        var myLessons = [];
        var slides = [];
        var practices = [];

        for (lessons of innerList) {
            let j = 0;
            for (content of lessons['inner-list']) {
                var slide = {};
                // img = fileNames[j];
                // let values = Object.values(img);
                var video = '';
                var attachment = '';
                for (files of fileNames) {
                    let keys = Object.keys(files);
                    let values = Object.values(files);
                    if (keys == `outer-list[${i}][inner-list][${j}][slide_video]`) {
                        video = values[0];
                    }
                    if (keys == `outer-list[${i}][inner-list][${j}][slide_attachments]`) {
                        attachment = values;
                    }
                }

                //console.log(video[0],attachment);

                // slide object creation
                slide = {};
                slide['title'] = content.slide_title;
                slide['duration'] = content.slide_duration;
                slide['description'] = content.slide_description; //
                slide['video_url'] = content.slide_video_url;
                slide['video'] = video;
                slide['attachments'] = attachment;
                slides.push(slide);

                // question object creation
                question = {};
                question['question_type'] = content[0];
                question['question_title'] = content.question_title;
                question['question_duration'] = content.question_duration;
                question['question_description'] = content.question_description; //
                question['question_image'] = content.question_image; //

                let deepInnerList = content['deep-inner-list'];
                let k = 0;
                var options = [];

                if (typeof deepInnerList !== 'undefined' && deepInnerList.length > 0) {
                    for (deepContent of deepInnerList) {
                        // console.log(deepContent);
                        option = {};
                        option['option_image'] = deepContent.option_image;
                        option['option_text'] = deepContent.option_text;
                        option['option_explanation'] = deepContent.option_explanation; //
                        // option['option_display_preference'] = deepContent.option_display_preference;
                        // option['option_correct'] = deepContent.option_correct[0];
                        console.log(option);
                        options.push(option);
                        k++;
                    }
                    question['options'] = options; //
                }
                practices.push(question);
                var options = [];
                j++;
            }
            // lesson object creation
            var myLesson = {
                title: lessons.lesson_name,
                slides: slides,
                practices: practices,
            };

            // console.log(myLesson);

            // insert lesson content
            let lesson = await Lesson.create(myLesson);
            myLessons.push(lesson._id);
            var slides = [];
            var practices = [];
            i++;
        }

        if (fileNames.length > 0 && fileNames[0].thumbnail) {
            req.body.thumbnail = fileNames[0].thumbnail;
        }

        // learning content object
        var myContent = {
            grade_id: req.body.grade_id,
            topic_id: req.body.topic_id,
            sub_topic_id: (req.body.sub_topic_id ? req.body.sub_topic_id : null),
            title: req.body.title,
            short_description: req.body.short_description,
            thumbnail: (req.body.thumbnail != '' ? req.body.thumbnail : ''),
            lesson_ids: myLessons,
        };

        // insert learning content
        let learningContent = await LearningContent.create(myContent);
        console.log(learningContent);
        // if (learningContent) {
        //     req.flash('success', 'learningContent is Created successfully!');
        //     res.status(200).json({ "success": true, "message": "learningContent is created successfully!", "redirectUrl": "/learning-content" });
        // }
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
    let id = req.params.id;
    let Content = await LearningContent.find({ "_id": id });
    if (Content[0].thumbnail != '') {
        const filePath = './assets/LearningContent/' + Content[0].thumbnail;
        fs.exists(filePath, function (exists) {
            if (exists) {
                fs.unlinkSync(filePath);
            } else {
                console.log('File not found, so not deleted.');
            }
        });
    }
    for (lession of Content[0].lesson_ids) {
        let lessionDetails = await Lesson.find({ "_id": lession });
        for (slides of lessionDetails[0].slides) {
            if (slides.video != '') {
                const filePath = './assets/LearningContent/' + slides.video;
                fs.exists(filePath, function (exists) {
                    if (exists) {
                        fs.unlinkSync(filePath);
                    } else {
                        console.log('File not found, so not deleted.');
                    }
                });
            }
            for (attachment of slides.attachments) {
                if (attachment != '') {
                    const filePath = './assets/LearningContent/' + attachment;
                    fs.exists(filePath, function (exists) {
                        if (exists) {
                            fs.unlinkSync(filePath);
                        } else {
                            console.log('File not found, so not deleted.');
                        }
                    });
                }
            }
        }
        let lessionDeleted = await Lesson.findByIdAndDelete(lession);
    }
    let ContentDeleted = await LearningContent.findByIdAndDelete(id);
    req.flash('success', 'Content is deleted successfully!');
    return res.redirect('/learning-content');
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
        let courseId = req.params.id;
        let results = await LearningContent.find({ "_id": courseId }).populate('grade_id').populate('topic_id').populate('sub_topic_id').populate('lesson_ids');
        let durations = [];
        let totalSlides = 0;
        let i = 0;
        global.learningContent = results[0].lesson_ids;
        var totalDuration = globalHelper.calculateDuration(durations);
        if (results[0]) {
            return res.render('../views/admin/learningContent/viewCourses', { content: results[0].lesson_ids[0], fs: fs, totalDuration: totalDuration });
        }
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

