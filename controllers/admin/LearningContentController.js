const Topic = require('../../models/Topic');
const SubTopic = require('../../models/SubTopic');
const Grade = require('../../models/Grade');
const fs = require('fs');
let session = require('express-session');
var slugify = require('slugify')

module.exports = {
    index,
    create,
    store,
    edit,
    update,
    destroy,
    previewCourses,
    viewCourses,
    singleSelectText,
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
 * create content.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        let activeTopics = await Topic.find({ "status": 1 }).sort({ '_id': -1 });
        let activeGrades = await Grade.find({ "status": 1 }).sort({ '_id': -1 });
        return res.render('../views/admin/learningContent/create', { topics: activeTopics, grades: activeGrades });
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



