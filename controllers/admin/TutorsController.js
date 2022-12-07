const User = require('../../models/user');
const Category = require('../../models/Category');
const fs = require('fs');
const global = require("../../_helper/GlobalHelper");

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
 * List Tutor 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let tutors = await User.find({ "role": 2 }).sort({ '_id': -1 });

        return res.render('../views/admin/tutors/index', { data: tutors, fs: fs });
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

/**
 * create Tutor
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        let activeCategories = await Category.find({ "status": 1 }).sort({ '_id': -1 });
        return res.render('../views/admin/tutors/create', { data: activeCategories });
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}


/**
 * store Tutor
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function store(req, res) {
    try {
        // console.log(req.body);
        if (req.file != undefined) {
            req.body.profile_image = req.file.filename;
        } else {
            req.body.profile_image = '';
        }

        // role for tutor
        req.body.role = 2;
        let hash = global.securePassword(req.body.password);
        req.body.password = hash;
        // console.log(req.body);

        let tutor = await User.create(req.body);
        if (tutor) {
            res.status(200).json({ "success": true, "message": "Tutor is created successfully!", "redirectUrl": "/tutors" });
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
 * edit Tutor
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */


async function edit(req, res) {
    try {
        let userId = req.params.id;
        let user = await User.find({ "_id": userId, "role": 2 });
        if (user) {
            console.log(user);
            let activeCategories = await Category.find({ "status": 1 }).sort({ '_id': -1 });
            return res.render('../views/admin/tutors/edit', { data: user[0], subjects: activeCategories, fs: fs });
        }
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}



/**
 * update Tutor
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */


async function update(req, res) {
    try {
        if (req.body.tutor_id && req.body.tutor_id != '') {

            let user = await User.find({ "_id": req.body.tutor_id, "role": 2 });
            if (user) {
                userData = user[0];
                let userImage = userData.profile_image;
                const filePath = './assets/ProfileImage/' + userImage;

                req.body.role = 2;
                let hash = global.securePassword(req.body.password);
                req.body.password = hash;

                if (req.file != undefined) {
                    if (userImage != '') {
                        fs.exists(filePath, function (exists) {
                            if (exists) {
                                fs.unlinkSync(filePath);
                            } else {
                                // console.log('File not found, so not deleting.');
                            }
                        });
                    }

                    req.body.profile_image = req.file.filename;

                    let userUpdated = await User.findByIdAndUpdate(req.body.tutor_id, req.body)


                } else {

                    if (req.body.is_remove == 1) {
                        let userUpdated = await User.updateOne({ "_id": req.body.tutor_id }, {
                            $set:
                            {
                                tutor_subject_ids: req.body.tutor_subject_ids,
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                                email: req.body.email,
                                password: req.body.password,
                                address: req.body.address,
                                calendar_color: req.body.calendar_color,
                                profile_image: '',
                                note: req.body.note,
                                status: req.body.status,
                                role: req.body.role,
                            }
                        })
                    }
                    else {
                        let userUpdated = await User.updateOne({ "_id": req.body.tutor_id }, {
                            $set:
                            {
                                tutor_subject_ids: req.body.tutor_subject_ids,
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                                email: req.body.email,
                                password: req.body.password,
                                address: req.body.address,
                                calendar_color: req.body.calendar_color,
                                note: req.body.note,
                                status: req.body.status,
                                role: req.body.role,
                            }
                        })
                    }
                }

                res.status(200).json({ "success": true, "message": "User is updated successfully!", "redirectUrl": "/tutors" });
            }
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
    }
}



/**
 * delete Tutor
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function destroy(req, res) {
    try {
        let id = req.params.id;
        let tutorDeleted = await User.findByIdAndDelete(id);
        if (tutorDeleted) {
            req.flash('success', 'Tutor is deleted successfully!');
        }
        return res.redirect('/tutors');
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}