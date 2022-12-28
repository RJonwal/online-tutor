const Topic = require('../../models/Topic');
const SubTopic = require('../../models/SubTopic');
const Grade = require('../../models/Grade');
const fs = require('fs');
let session = require('express-session');
var slugify = require('slugify')

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
    try{
        console.log(req.body);
        console.log('learning form');
        let innerList = req.body['outer-list'];
        // for(test of innerList){
        //     console.log(test);
        // }
        //console.log(req.files);
    }catch (e){

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

