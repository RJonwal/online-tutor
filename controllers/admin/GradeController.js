const Grade = require('../../models/grade');
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
 * Create Grade 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 async function index(req, res) {
    try {
        let Grades = await Grade.find({}).sort({ '_id': -1 });
        return res.render('../views/admin/grade/index', { data: Grades });
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

/**
 * create Grade
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        return res.render('../views/admin/grade/create');
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}


/**
 * store Grade
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function store(req, res) {
    try {
        let grade = await Grade.create(req.body);
        if (grade) {
            req.flash('success', 'Grade is created successfully!');
        }
        return res.redirect('/grade');
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}


/**
 * edit Grade
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 async function edit(req, res) {
    try {
        let gradeId = req.params.id;
        let grade = await Grade.find({ "_id": gradeId });
        if (grade) {
            return res.render('../views/admin/grade/edit', { data: grade[0] });
        }
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

/**
 * update school
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 async function update(req, res) {
    try {
        if (req.body.grade_id && req.body.grade_id != '') {
            let school = await Grade.findByIdAndUpdate(req.body.grade_id, req.body)
            req.flash('success', 'Grade is updated successfully!');
            return res.redirect('/grade');
        }
        
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

/**
 * delete Grade
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

async function destroy(req, res) {
    try {
        let id = req.params.id;
        let GradeDeleted = await Grade.findByIdAndDelete(id);
        if (GradeDeleted) {
            req.flash('success', 'Grade is deleted successfully !');
        }
        return res.redirect('/grade');
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}