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
 * Create SubCategory 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        return res.render('../views/admin/courses/myCourses');
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

/**
 * create SubCategory
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        return res.render('../views/admin/courses/create');
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

/**
 * add courses
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 async function addCourses(req, res) {
    try {
        return res.render('../views/admin/courses/addCourses' );
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}


/**
 * store SubCategory
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function store(req, res) {

}


/**
 * edit SubCategory
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function edit(req, res) {

}


/**
 * update SubCategory
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function update(req, res) {

}


/**
 * Preview Courses
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 async function previewCourses(req, res) {
    try {
        return res.render('../views/admin/courses/previewCourses');
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

/**
 * Preview Courses
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 async function viewCourses(req, res) {
    try {
        return res.render('../views/admin/courses/viewCourses');
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
/**
 * delete SubCategory
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function destroy(req, res) {

}


