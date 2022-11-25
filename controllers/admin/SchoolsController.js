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
 * Create school 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let schools = await School.find({}).sort({ '_id': -1 });
        return res.render('../views/admin/schools/index', { data: schools });
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

/**
 * create school
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        return res.render('../views/admin/schools/create');
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}


/**
 * store school
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function store(req, res) {
    try {
        let school = await School.create(req.body);
        if (school) {
            req.flash('success', 'School is created successfully!');
        }
        return res.redirect('/schools');
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}


/**
 * edit school
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function edit(req, res) {
    try {
        let schoolId = req.params.id;
        let school = await School.find({ "_id": schoolId });
        if (school) {
            return res.render('../views/admin/schools/edit', { data: school[0] });
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
        if (req.body.school_id && req.body.school_id != '') {
            let school = await School.findByIdAndUpdate(req.body.school_id, req.body)
            console.log(school);
            req.flash('success', 'School is updated successfully!');
            return res.redirect('/schools');
        }
        
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}


/**
 * delete school
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function destroy(req, res) {
    try {
        let id = req.params.id;
        let schoolDeleted = await School.findByIdAndDelete(id);
        if (schoolDeleted) {
            req.flash('success', 'School is deleted successfully !');
        }
        return res.redirect('/schools');
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}