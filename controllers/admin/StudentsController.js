
const User = require('../../models/user');
const School = require('../../models/School');
const Grade = require('../../models/Grade');
const moment = require('moment');
const fs = require('fs');
let session = require('express-session');

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


/**
 * Create Student 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let student = await User.find({ "role": 3 }).sort({ first_name: 1 });
        let grade = await Grade.find({ "status": 1 }).sort({ 'name': 1 });

        let totalStudent = await User.find({ "role": 3 }).sort({ '_id': -1 }).count();
        let activeStudent = await User.find({ $and: [{ "role": 3 }, { "status": 1 }] }).sort({ '_id': -1 }).count();
        let deactiveStudent = await User.find({ $and: [{ "role": 3 }, { "status": 0 }] }).sort({ '_id': -1 }).count();
        const studentObject = { 'total': totalStudent, 'active': activeStudent, 'deactive': deactiveStudent }

        return res.render('../views/admin/students/index', { fs: fs, studentObject: studentObject, students: student, grade, grade });
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
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
    if (req.body.id) {
        obj["_id"] = req.body.id;
    }
    if (req.body.grade) {
        obj["grade_id"] = req.body.grade;
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

    const filter = ['profile_image', 'first_name', 'dial_code', 'email', 'status'];
    const column_name = filter[req.body.order[0].column];
    const order_by = req.body.order[0].dir;
    var recordsTotal = 0;
    var recordsFiltered = 0;
    User.count({ "role": 3 }, function (err, c) {
        recordsTotal = c;
        User.count({ $and: [{ "role": 3 }, obj, searchStr] }, function (err, c) {
            recordsFiltered = c;
            User.find({ $and: [{ "role": 3 }, obj, searchStr] }, '_id profile_image email first_name last_name dial_code phone status', { 'skip': Number(req.body.start), 'limit': Number(req.body.length) }, function (err, results) {
                if (err) {
                    console.log('error while getting results' + err);
                    return;
                }
                var data = JSON.stringify({
                    "draw": req.body.draw,
                    "recordsFiltered": recordsFiltered,
                    "recordsTotal": recordsTotal,
                    "data": results
                });
                return res.send(data);
            }).populate('grade_id').sort({ [column_name]: order_by });
        });
    });
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
        let grade = await Grade.find({ "status": 1 });
        return res.render('../views/admin/students/create', { data: schools, grade: grade });
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
        let student = await User.create(req.body);
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
        let grade = await Grade.find({ "status": 1 });
        let student = await User.find({ "_id": StudentId });
        let start_date = res.locals.moment(student[0].start_date).format('YYYY-MM-DD');
        let birth_day = res.locals.moment(student[0].birth_day).format('YYYY-MM-DD');
        if (student) {
            return res.render('../views/admin/students/edit', { data: student[0], grade: grade, school_data: schools, start_date: start_date, birth_day: birth_day, fs: fs });
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
            let Student_details = await User.find({ "_id": req.body.student_id });
            if (Student_details) {

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
                    let student = await User.findByIdAndUpdate(req.body.student_id, req.body)
                } else {
                    delete req.body.profile_image

                    let student = await User.findByIdAndUpdate(req.body.student_id, req.body)
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
        let StudentDeleted = await User.findByIdAndDelete(id);
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
                req.flash('success', 'Student is deleted successfully!');
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
            let status = ((req.body.status == 'true') ? '1' : '0');
            let tutor = await User.findByIdAndUpdate(req.body.uid, { status: status });
            res.status(200).json({ "success": true, "message": "Student status is updated successfully!" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}