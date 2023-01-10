const Assessment = require('../../models/Assessment');
const User = require('../../models/user');
const Topic = require('../../models/Topic');
const SubTopic = require('../../models/SubTopic');
const Grade = require('../../models/Grade');
const LearningContent = require('../../models/LearningContent');
const Lesson = require('../../models/Lesson');
const globalHelper = require('../../_helper/GlobalHelper');

let session = require('express-session');

module.exports = {
    index,
    create,
    store,
    edit,
    update,
    destroy,
}


/**
 * list assessments.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        return res.render('../views/admin/assessments/index');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * create assessments.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        let activeGrades = await Grade.find({ "status": 1 }).sort({ '_id': -1 });
        let activeTutors = await User.find({ "role": 2 }).sort({ '_id': -1 });
        let activeTopics = await Topic.find({ "status": 1 }).sort({ '_id': -1 });
    
        return res.render('../views/admin/assessments/create', { grades: activeGrades, tutors: activeTutors, topics: activeTopics, moment: res.locals.moment });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * store assessments.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function store(req, res) {
    try {

    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
    }
}

/**
 * edit assessments.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function edit(req, res) {
    try {

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * update assessments.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function update(req, res) {
    try {

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * delete assessments.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function destroy(req, res) {
    try {

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}
