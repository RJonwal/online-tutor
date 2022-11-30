const SubCategory = require('../../models/SubCategory');
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

const slugify_options = {
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true,      // convert to lower case, defaults to `false`
    strict: false,     // strip special characters except replacement, defaults to `false`
    locale: 'en',       // language code of the locale to use
    trim: true         // trim leading and trailing replacement chars, defaults to `true`
}


/**
 * Create Category 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let subCategories = await SubCategory.find({}).sort({ '_id': -1 });
        return res.render('../views/admin/subCategories/index', { data: subCategories, fs: fs });
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

/**
 * create Category
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        return res.render('../views/admin/subCategories/create');
    } catch (e) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}


/**
 * store Category
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function store(req, res) {
    try {
        console.log("R;KGOIDRSGPLFDJG;KFDJGKFD");

        console.log(req.body);
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
 * edit Category
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function edit(req, res) {
    try {
        let subCategoryId = req.params.id;
        let subCategory = await SubCategory.find({ "_id": subCategoryId });
        if (subCategory) {
            return res.render('../views/admin/subCategories/edit', { data: subCategory[0], fs: fs });
        }
    } catch (e) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}


/**
 * update Category
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
                let subCategoryUpdated = await SubCategory.updateOne({ "_id": req.body.sub_category_Id }, {
                    $set:
                    {
                        name: req.body.name,
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
 * delete Category
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