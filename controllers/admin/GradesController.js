const Grade = require('../../models/Grade');
let session = require('express-session');
module.exports = {
    index,
    create,
    store,
    edit,
    update,
    destroy,
    updateStatus,
}


/**
 * list grade.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let grades = await Grade.find({}).sort({ '_id': -1 });
        return res.render('../views/admin/grades/index', { data: grades, moment: res.locals.moment });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * create grade.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        return res.render('../views/admin/grades/create');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}


/**
 * store grade.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function store(req, res) {
    try {
        let grade = await Grade.create(req.body);
        if (grade) {
            res.status(200).json({ "success": true, "message": "Grade is created successfully!", "redirectUrl": "/grades" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
    }
}


/**
 * edit grade.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function edit(req, res) {
    try {
        let grade = await Grade.find({ "_id": req.params.id });
        if (grade) {
            return res.render('../views/admin/grades/edit', { data: grade[0] });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * update grade.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function update(req, res) {
    try {
        if (req.body.grade_id && req.body.grade_id != '') {
            let grade = await Grade.findByIdAndUpdate(req.body.grade_id, req.body);
            res.status(200).json({ "success": true, "message": "Grade is updated successfully!", "redirectUrl": "/grades" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * delete grade.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

async function destroy(req, res) {
    try {
        let grade = await Grade.findByIdAndDelete(req.params.id);
        if (grade) {
            req.flash('success', 'Grade is deleted successfully!');
        }
        return res.redirect('/grades');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}


/** 
 * update status of the grade.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateStatus(req, res) {
    try {
        if (req.body.uid && req.body.uid != '') {
            let status = ((req.body.status == 'true') ? '1' : '0');
            let grade = await Grade.findByIdAndUpdate(req.body.uid, { status: status });
            console.log(grade);
            res.status(200).json({ "success": true, "message": "Grade status is updated successfully!" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}