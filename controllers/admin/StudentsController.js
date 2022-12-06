const Student = require('../../models/user');
const School = require('../../models/school');

let session = require('express-session');
module.exports = {
    index,
    create,
    store,
    edit,
    update,
    destroy,
}

/**
 * Create Student 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let Students = await Student.find({}).sort({ '_id': -1 });
        return res.render('../views/admin/students/index', { data: Students });
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
        let schools = await School.find({"status":1}).sort({ '_id': -1 });
        return res.render('../views/admin/students/create',{data:schools});
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
        let student = await Student.create(req.body);
        if (student) {
            res.status(200).json({ "success": true, "message": "Student is created successfully!", "redirectUrl": "/Students" });
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
 * edit Student
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function edit(req, res) {
    try {
        let StudentId = req.params.id;
        let student = await Student.find({ "_id": StudentId });
        if (student) {
            return res.render('../views/admin/students/edit', { data: student[0] });
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
        if (req.body.Student_id && req.body.Student_id != '') {
            let student = await Student.findByIdAndUpdate(req.body.Student_id, req.body)
            res.status(200).json({ "success": true, "message": "Student is updated successfully!", "redirectUrl": "/Students" });
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
            req.flash('success', 'Student is deleted successfully !');
        }
        return res.redirect('/Students');
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}