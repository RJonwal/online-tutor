const User = require('../../models/user');
const Topic = require('../../models/Topic');
const fs = require('fs');
const global = require("../../_helper/GlobalHelper");
const mongoose = require('mongoose');

let session = require('express-session');
var slugify = require('slugify');

module.exports = {
    index,
    dataTable,
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
 * list tutor. 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let tutors = await User.find({ "role": 2 }).sort({ '_id': -1 });
        let subject = await Topic.find({ "status": 1 });
        let totalTutor = await User.find({ "role": 2 }).sort({ '_id': -1 }).count();
        let activeTutor = await User.find({ $and: [{ "role": 2 }, { "status": 1 }] }).sort({ '_id': -1 }).count();
        let deactiveTutor = await User.find({ $and: [{ "role": 2 }, { "status": 0 }] }).sort({ '_id': -1 }).count();

        const tutorObject = { 'total': totalTutor, 'active': activeTutor, 'deactive': deactiveTutor }

        return res.render('../views/admin/tutors/index', { data: tutors, fs: fs, subject: subject, tutorObject: tutorObject });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * dataTable
 * @param {*} req 
 * @param {*} res 
 */
async function dataTable(req, res) {
    var searchStr = req.body.search.value;
    var obj = {};
    var subject_ids = [];
    if (req.body.id) {
        obj["_id"] = req.body.id;
    }

    if (req.body.tutor_subjects) {
        // { quantity: { $in: req.body.tutor_subjects } }
        let tutor_subject_ids = req.body.tutor_subjects;
        subject_ids = tutor_subject_ids.map(function (element) {
            return mongoose.Types.ObjectId(element)
        }, this);
        obj["subject_ids"] = { $in: subject_ids };
    }
    if (req.body.status) {
        obj["status"] = req.body.status;
    }
    if (req.body.search.value) {
        var regex = new RegExp(req.body.search.value, "i")
        searchStr = { $or: [{ 'first_name': regex }, { 'email': regex }, { 'phone': regex }] };
    }
    else {
        searchStr = {};
    }

    const filter = ['', 'first_name', 'email', 'dial_code', 'course', 'subject_ids', 'status'];
    const column_name = filter[req.body.order[0].column];
    const order_by = req.body.order[0].dir;
    var recordsTotal = 0;
    var recordsFiltered = 0;
    let subject = await Topic.find({});
    recordsTotal = await User.count({ "role": 2 });
    recordsFiltered = await User.count({ $and: [{ "role": 2 }, obj, searchStr] });
    let results = await User.find({ $and: [{ "role": 2 }, obj, searchStr] }, '_id profile_image email first_name last_name dial_code phone subject_ids status', { 'skip': Number(req.body.start), 'limit': Number(req.body.length) }).populate('subject_ids').sort({ [column_name]: order_by });
    var data = JSON.stringify({
        "draw": req.body.draw,
        "recordsFiltered": recordsFiltered,
        "recordsTotal": recordsTotal,
        "data": results
    });
    return res.send(data);
}

/**
 * create tutor.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        let activeSubjects = await Topic.find({ "status": 1 }).sort({ '_id': -1 });
        return res.render('../views/admin/tutors/create', { data: activeSubjects });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}


/**
 * store tutor.
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
        if (req.body.password) {
            let hash = global.securePassword(req.body.password);
            req.body.password = hash;
        } else {
            delete req.body.password;
        }
        // console.log(req.body);

        let tutor = await User.create(req.body);
        if (tutor) {
            req.flash('success', 'Tutor is Created successfully!');
            res.status(200).json({ "success": true, "message": "Tutor is created successfully!", "redirectUrl": "/tutors" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}


/**
 * edit tutor.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function edit(req, res) {
    try {
        let tutorId = req.params.id;
        let tutor = await User.find({ "_id": tutorId, "role": 2 });
        if (tutor) {
            let activeCategories = await Topic.find({ "status": 1 }).sort({ '_id': -1 });
            return res.render('../views/admin/tutors/edit', { data: tutor[0], subjects: activeCategories, fs: fs });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}


/**
 * update tutor.
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
                                phone: req.body.phone,
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
                                phone: req.body.phone,
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
                req.flash('success', 'Tutor is updated successfully!');
                res.status(200).json({ "success": true, "message": "Tutor is updated successfully!", "redirectUrl": "/tutors" });
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
 * delete tutor.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function destroy(req, res) {
    try {
        let id = req.params.id;
        let tutorDeleted = await User.findByIdAndDelete(id);
        if (tutorDeleted) {
            let tutorImage = tutorDeleted.profile_image;
            if (tutorImage != '') {
                const filePath = './assets/ProfileImage/' + tutorImage;
                fs.exists(filePath, function (exists) {
                    if (exists) {
                        fs.unlinkSync(filePath);
                    } else {
                        console.log('File not found, so not deleted.');
                    }
                });
            }
        }
        req.flash('success', 'Tutor is deleted successfully!');
        return res.redirect('/tutors');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}


/**
 * update status of the tutor.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateStatus(req, res) {
    try {
        if (req.body.uid && req.body.uid != '') {

            let status = ((req.body.status == 'true') ? '1' : '0');
            let tutor = await User.findByIdAndUpdate(req.body.uid, { status: status });

            res.status(200).json({ "success": true, "message": "Tutor status is updated successfully!" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}