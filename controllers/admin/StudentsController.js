
const Student = require('../../models/user');
const School = require('../../models/School');
const moment = require('moment');

const fs = require('fs');
let session = require('express-session');
module.exports = {
    index,
    create,
    store,
    edit,
    update,
    destroy,
    updateStatus
}

/**
 * Create Student 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let Students = await Student.find({ "role": 3 }).sort({ '_id': -1 });

        let totalStudent  = await Student.find({ "role": 3 }).sort({ '_id': -1 }).count();
        let activeStudent  = await Student.find({ $and: [ { "role": 3  }, { "status": 1  } ] } ).sort({ '_id': -1 }).count();
        let deactiveStudent  = await Student.find({ $and: [ { "role": 3  }, { "status": 0  } ] } ).sort({ '_id': -1 }).count();

        const studentObject = {'total':totalStudent,'active':activeStudent,'deactive':deactiveStudent}
        return res.render('../views/admin/students/index', { data: Students,fs:fs,studentObject:studentObject });
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

/**
 * create Student
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        let schools = await School.find({ "status": 1 }).sort({ '_id': -1 });
        return res.render('../views/admin/students/create', { data: schools });
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

/**
 * store Student
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function store(req, res) {
    try {
        if (req.file != undefined) {
            req.body.profile_image = req.file.filename;
        } else {
            req.body.profile_image = '';
        }
        // set role for students
        req.body.role = 3;
        let student = await Student.create(req.body);
        if (student) {
            req.flash('success', 'Student is created successfully!');
            res.status(200).json({ "success": true, "message": "Student is created successfully!", "redirectUrl": "/Students" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
    }
}


/**
 * edit Student
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function edit(req, res) {
    try {
        let StudentId = req.params.id;
        let schools = await School.find({ "status": 1 }).sort({ '_id': -1 });
        let student = await Student.find({ "_id": StudentId });
        let start_date = res.locals.moment(student[0].start_date).format('YYYY-MM-DD');
        let birth_day = res.locals.moment(student[0].birth_day).format('YYYY-MM-DD');
        if (student) {
            return res.render('../views/admin/students/edit', { data: student[0], school_data: schools, start_date: start_date, birth_day: birth_day, fs: fs });
        }
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}


/**
 * update Student
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function update(req, res) {
    try {
        if (req.body.student_id && req.body.student_id != '') {
            let Student_details = await Student.find({ "_id": req.body.student_id });
            if (Student_details) {
                console.log(Student_details);
                studentData = Student_details[0];
                let profileImage = studentData.profile_image;
                const filePath = './assets/profileImage/' + profileImage;

                if (req.file != undefined) {
                    if (profileImage != '') {
                        fs.exists(filePath, function (exists) {
                            if (exists) {
                                fs.unlinkSync(filePath);
                            } else {
                                // console.log('File not found, so not deleting.');
                            }
                        });
                    }
                    req.body.profile_image = req.file.filename;
                    let student = await Student.findByIdAndUpdate(req.body.student_id, req.body)
                } else {
                    delete req.body.profile_image
                    console.log(req.body.student_id);
                    let student = await Student.findByIdAndUpdate(req.body.student_id, req.body)
                }
                req.flash('success', 'Student is updated successfully!');
                res.status(200).json({ "success": true, "message": "Student is updated successfully!", "redirectUrl": "/Students" });
            }
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
    }
}


/**
 * delete Student
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function destroy(req, res) {
    try {
        let id = req.params.id;
        let StudentDeleted = await Student.findByIdAndDelete(id);
        if (StudentDeleted) {
            let studentImage = StudentDeleted.profile_image;
            if (studentImage != '') {
                const filePath = './assets/ProfileImage/' + studentImage;
                fs.exists(filePath, function (exists) {
                    if (exists) {
                        fs.unlinkSync(filePath);
                    } else {
                        console.log('File not found, so not deleted.');
                    }
                });
                req.flash('success', 'Tutor is deleted successfully!');
            }
        }
        return res.redirect('/Students');
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
            let tutor = await Student.findByIdAndUpdate(req.body.uid, { status: status });
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