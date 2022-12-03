const SubCategory = require('../../models/SubCategory');
const Category = require('../../models/Category');
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
}

/**
 * Create SubCategory 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        return res.render('../views/admin/courses/myCourses' );
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
        return res.render('../views/admin/courses/create' );
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
 * delete SubCategory
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function destroy(req, res) {

}