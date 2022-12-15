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
    updateStatus
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
 * list category.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let categories = await Category.find({}).sort({ '_id': -1 });

        let totalCategory  = await Category.find({ "role": 2 }).sort({ '_id': -1 }).count();
        let activeCategory  = await Category.find({ "status": 1  }  ).sort({ '_id': -1 }).count();
        let deactiveCategory = await Category.find({ "status": 0  } ).sort({ '_id': -1 }).count();

        const CategoryObject = {'total':totalCategory,'active':activeCategory,'deactive':deactiveCategory}

        return res.render('../views/admin/categories/index', { data: categories, fs: fs, moment: res.locals.moment,CategoryObject:CategoryObject });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * create category.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        return res.render('../views/admin/categories/create');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * store category.
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
        req.flash('success', 'Category created successfully!');
        if (category) {
            res.status(200).json({ "success": true, "message": "Category is created successfully!", "redirectUrl": "/categories" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
    }
}

/**
 * edit category.
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
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * update category.
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

                let slug = '';
                req.body.slug = slugify(req.body.name, slugify_options);

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
                        let category = await Category.find({ "_id": req.body.category_id });
                        categoryData = category[0];
                        let categoryImage = categoryData.category_image;
                        const filePath = './assets/CategoryImage/' + categoryImage;

                        if (categoryImage != '') {
                            fs.exists(filePath, function (exists) {
                                if (exists) {
                                    fs.unlinkSync(filePath);
                                } else {
                                    // console.log('File not found, so not deleting.');
                                }
                            });
                        }
                        let categoryUpdated = await Category.updateOne({ "_id": req.body.category_id }, {
                            $set:
                            {
                                name: req.body.name,
                                slug: req.body.slug,
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
                                slug: req.body.slug,
                                note: req.body.note,
                                status: req.body.status
                            }
                        })
                    }
                }
                req.flash('success', 'Category updated successfully!');
                res.status(200).json({ "success": true, "message": "Category is updated successfully!", "redirectUrl": "/categories" });
            }
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * delete category.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function destroy(req, res) {
    try {
        let id = req.params.id;
        let categoryDeleted = await Category.findByIdAndDelete(id);
        if (categoryDeleted) {
            let categoryImage = categoryDeleted.category_image;
            if(categoryImage != ''){
                const filePath = './assets/CategoryImage/' + categoryImage;
                fs.exists(filePath, function (exists) {
                    if (exists) {
                        fs.unlinkSync(filePath);
                    } else {
                        console.log('File not found, so not deleted.');
                    }
                });
            }
            
            req.flash('success', 'Category is deleted successfully !');
        }
        return res.redirect('/categories');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/** 
 * update status of the category.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateStatus(req, res) {
    try {
        if (req.body.uid && req.body.uid != '') {
            let status = ((req.body.status == 'true') ? '1' : '0');
            let category = await Category.findByIdAndUpdate(req.body.uid, { status: status });
        
            res.status(200).json({ "success": true, "message": "Category status is updated successfully!" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}