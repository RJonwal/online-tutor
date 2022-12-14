const SubCategory = require('../../models/SubCategory');
const Category = require('../../models/Category');
const fs = require('fs');
let session = require('express-session');
var slugify = require('slugify')

module.exports = {
    index,
    create,
    addCourses,
    store,
    edit,
    update,
    previewCourses,
    viewCourses,
    destroy,
}

/**
 * list courses. 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        return res.render('../views/admin/courses/myCourses');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * create course.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        return res.render('../views/admin/courses/create');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * add course.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function addCourses(req, res) {
    try {
        return res.render('../views/admin/courses/addCourses');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}


/**
 * store course.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function store(req, res) {

}


/**
 * edit course.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function edit(req, res) {

}


/**
 * update course.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function update(req, res) {

}


/**
 * preview course.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function previewCourses(req, res) {
    try {
        return res.render('../views/admin/courses/previewCourses');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * view course.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function viewCourses(req, res) {
    try {
        return res.render('../views/admin/courses/viewCourses');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * delete course
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function destroy(req, res) {

}


