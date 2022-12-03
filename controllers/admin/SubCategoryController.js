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
 * Create SubCategory 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let subCategories = await SubCategory.find({}).populate('category_id').sort({ '_id': -1 });
        console.log(subCategories);
        return res.render('../views/admin/subCategories/index', { data: subCategories, fs: fs });
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
        let activeCategories = await Category.find({ "status": 1 }).sort({ '_id': -1 });
        return res.render('../views/admin/subCategories/create', { data: activeCategories });
    } catch (e) {
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
 * edit SubCategory
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
            message: 'Internal Server Error'
        })
    }
}


/**
 * update SubCategory
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
 * delete SubCategory
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
            message: 'Internal Server Error'
        })
    }
}