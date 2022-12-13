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
 * List Tutor 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let tutors = await User.find({ "role": 2 }).sort({ '_id': -1 });
        
        let subject = await Category.find({});
        return res.render('../views/admin/tutors/index', { data: tutors, fs: fs,subject:subject });
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
        let activeSubjects = await Category.find({ "status": 1 }).sort({ '_id': -1 });
        return res.render('../views/admin/tutors/create', { data: activeSubjects });
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
        if(req.body.password){
            let hash = global.securePassword(req.body.password);
            req.body.password = hash;
        }else{
            delete req.body.password;
        }
        // console.log(req.body);

        let tutor = await User.create(req.body);
        if (tutor) {
            res.status(200).json({ "success": true, "message": "Tutor is created successfully!", "redirectUrl": "/tutors" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
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
        let tutorId = req.params.id;
        let tutor = await User.find({ "_id": tutorId, "role": 2 });
        if (tutor) {
            console.log(tutor);
            let activeCategories = await Category.find({ "status": 1 }).sort({ '_id': -1 });
            return res.render('../views/admin/tutors/edit', { data: tutor[0], subjects: activeCategories, fs: fs });
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
            let tutor = await User.find({ "_id": req.body.tutor_id, "role": 2 });
            if (tutor) {
                tutorData = tutor[0];
                let tutorImage = tutorData.profile_image;
                const filePath = './assets/ProfileImage/' + tutorImage;

                req.body.role = 2;
                if (req.body.password) {
                    let hash = global.securePassword(req.body.password);
                    req.body.password = hash;
                } else {
                    delete req.body.password
                }

                if (req.file != undefined) {
                    if (tutorImage != '') {
                        fs.exists(filePath, function (exists) {
                            if (exists) {
                                fs.unlinkSync(filePath);
                            } else {
                                // console.log('File not found, so not deleting.');
                            }
                        });
                    }

                    req.body.profile_image = req.file.filename;

                    let tutorUpdated = await User.findByIdAndUpdate(req.body.tutor_id, req.body)
                } else {
                    if (req.body.is_remove == 1) {
                        let tutorUpdated = await User.updateOne({ "_id": req.body.tutor_id }, {
                            $set:
                            {
                                subject_ids: req.body.subject_ids,
                                title: req.body.title,
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
                        let tutorUpdated = await User.updateOne({ "_id": req.body.tutor_id }, {
                            $set:
                            {
                                subject_ids: req.body.subject_ids,
                                title: req.body.title,
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

                res.status(200).json({ "success": true, "message": "Tutor is updated successfully!", "redirectUrl": "/tutors" });
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
        console.log(tutorDeleted);
        if (tutorDeleted) {
            let tutorImage = tutorDeleted.profile_image;
            const filePath = './assets/ProfileImage/' + tutorImage;
            fs.exists(filePath, function (exists) {
                if (exists) {
                    fs.unlinkSync(filePath);
                } else {
                    console.log('File not found, so not deleted.');
                }
            });
            req.flash('success', 'Tutor is deleted successfully!');
        }
        return res.redirect('/tutors');
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

 
/**
 * update status of the Grade.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateStatus(req, res) {
    try {
        if (req.body.uid && req.body.uid != '') {
           
            let status = ((req.body.status=='true') ? '1' : '0');
            let tutor = await User.findByIdAndUpdate(req.body.uid, { status: status });
            console.log(tutor);
            res.status(200).json({ "success": true, "message": "Tutor status is updated successfully!" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}