const SubCategory = require('../../models/SubCategory');
const Category = require('../../models/Category');
const fs = require('fs');
let session = require('express-session');
var slugify = require('slugify');


module.exports = {
    index,
    create,
    store,
    edit,
    update,
    destroy,
    updateStatus,
}

const slugify_options = {
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true,      // convert to lower case, defaults to `false`
    strict: false,     // strip special characters except replacement, defaults to `false`
    locale: 'en',       // language code of the locale to use
    trim: true         // trim leading and trailing replacement chars, defaults to `true`
}


/**
 * list subCategory.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let subCategories = await SubCategory.find({}).populate('category_id').sort({ '_id': -1 });
        return res.render('../views/admin/subCategories/index', { data: subCategories, fs: fs, moment: res.locals.moment });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * create subCategory.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        let activeCategories = await Category.find({ "status": 1 }).sort({ '_id': -1 });
        return res.render('../views/admin/subCategories/create', { data: activeCategories });
    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * store subCategory.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function store(req, res) {
    try {
        let subCategory = await SubCategory.create(req.body);
        if (subCategory) {
            res.status(200).json({ "success": true, "message": "SubCategory is created successfully!", "redirectUrl": "/subCategories" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
    }
}

/**
 * edit subCategory.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function edit(req, res) {
    try {
        let subCategoryId = req.params.id;
        let subCategory = await SubCategory.find({ "_id": subCategoryId });
        let activeCategories = await Category.find({ "status": 1 }).sort({ '_id': -1 });
        if (subCategory) {
            return res.render('../views/admin/subCategories/edit', { data: subCategory[0], allCategories: activeCategories, fs: fs });
        }
    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * update subCategory.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function update(req, res) {
    try {
        if (req.body.sub_category_Id && req.body.sub_category_Id != '') {

            let subCategory = await SubCategory.find({ "_id": req.body.sub_category_Id });
            if (subCategory) {
                subCategoryData = subCategory[0];
                let slug = '';
                slug = slugify(req.body.name, slugify_options);

                let subCategoryUpdated = await SubCategory.updateOne({ "_id": req.body.sub_category_Id }, {
                    $set:
                    {
                        name: req.body.name,
                        slug: slug,
                        category_id: req.body.category_id,
                        note: req.body.note,
                        status: req.body.status
                    }
                })
            }

            res.status(200).json({ "success": true, "message": "SubCategory is updated successfully!", "redirectUrl": "/subCategories" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
    }
}

/**
 * delete subCategory.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function destroy(req, res) {
    try {
        let id = req.params.id;
        let subCategoryDeleted = await SubCategory.findByIdAndDelete(id);
        if (subCategoryDeleted) {
            req.flash('success', 'SubCategory is deleted successfully !');
        }
        return res.redirect('/subCategories');
    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/** 
 * update status of the subCategory.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateStatus(req, res) {
    try {
        if (req.body.uid && req.body.uid != '') {
            let status = ((req.body.status == 'true') ? '1' : '0');
            let subCategory = await SubCategory.findByIdAndUpdate(req.body.uid, { status: status });
            console.log(subCategory);
            res.status(200).json({ "success": true, "message": "SubCategory status is updated successfully!" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}