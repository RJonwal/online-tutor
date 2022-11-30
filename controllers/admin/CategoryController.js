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
        let categories = await Category.find({}).sort({ '_id': -1 });
        return res.render('../views/admin/categories/index', { data: categories, fs: fs });
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
        return res.render('../views/admin/categories/create');
    } catch {
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
        if (req.file != undefined) {
            req.body.category_image = req.file.filename;
        } else {
            req.body.category_image = '';
        }

        let category = await Category.create(req.body);
        if (category) {
            res.status(200).json({ "success": true, "message": "Category is created successfully!", "redirectUrl": "/categories" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
        // return res.status(500).json({
        //     message: 'Internal Server Error'
        // })
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
        let categoryId = req.params.id;
        let category = await Category.find({ "_id": categoryId });
        if (category) {
            return res.render('../views/admin/categories/edit', { data: category[0], fs: fs });
        }
    } catch {
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
        if (req.body.category_id && req.body.category_id != '') {
    
            let category = await Category.find({ "_id": req.body.category_id });
            if (category) {
                categoryData = category[0];
                let categoryImage = categoryData.category_image;
                const filePath = './assets/CategoryImage/' + categoryImage;

                if (req.file != undefined) {
                    if (categoryImage != '') {
                        fs.exists(filePath, function (exists) {
                            if (exists) {
                                fs.unlinkSync(filePath);
                            } else {
                                // console.log('File not found, so not deleting.');
                            }
                        });
                    }

                    req.body.category_image = req.file.filename;

                    let categoryUpdated = await Category.findByIdAndUpdate(req.body.category_id, req.body)
                    

                } else {

                    if (req.body.is_remove == 1) {
                        let categoryUpdated = await Category.updateOne({ "_id": req.body.category_id }, {
                            $set:
                            {
                                name: req.body.name,
                                category_image: '',
                                note: req.body.note,
                                status: req.body.status
                            }
                        })
                    }
                    else {
                        let categoryUpdated = await Category.updateOne({ "_id": req.body.category_id }, {
                            $set:
                            {
                                name: req.body.name,
                                note: req.body.note,
                                status: req.body.status
                            }
                        })
                    }
                }


                res.status(200).json({ "success": true, "message": "Category is updated successfully!", "redirectUrl": "/categories" });
            }
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
        let categoryDeleted = await Category.findByIdAndDelete(id);
        if (categoryDeleted) {
            req.flash('success', 'Category is deleted successfully !');
        }
        return res.redirect('/categories');
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}