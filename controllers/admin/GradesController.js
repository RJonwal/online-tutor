const Grade = require('../../models/Grade');
let session = require('express-session');
module.exports = {
    index,
    dataTable,
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

        let totalGrade  = await Grade.find({}).sort({ '_id': -1 }).count();
        let activeGrade  = await Grade.find( { "status": 1  } ).sort({ '_id': -1 }).count();
        let deactiveGrade  = await Grade.find( { "status": 0  }  ).sort({ '_id': -1 }).count();

        const gradeObject = {'total':totalGrade,'active':activeGrade,'deactive':deactiveGrade}
        
        return res.render('../views/admin/grades/index', { data: grades, moment: res.locals.moment,gradeObject:gradeObject });
        
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

    if (req.body.id) {
        obj["_id"] = req.body.id;
    }
    if (req.body.status) {
        obj["status"] = req.body.status;
    }
    if (req.body.search.value) {
        var regex = new RegExp(req.body.search.value, "i")
        searchStr = { $or: [{ 'name': regex }, { 'email': regex }, { 'phone': regex },{ 'address': regex }] };
    }
    else {
        searchStr = {};
    }

    const filter = ['name', 'status','created_at'];
    const column_name = filter[req.body.order[0].column];
    const order_by = req.body.order[0].dir;
    var recordsTotal = 0;
    var recordsFiltered = 0;
    recordsTotal    = await Grade.count({});
    recordsFiltered = await Grade.count({ $and: [obj, searchStr] });
    let results     = await Grade.find({ $and: [obj, searchStr] }, '_id name status created_at', { 'skip': Number(req.body.start), 'limit': Number(req.body.length) }).sort({ [column_name]: order_by });
    var data = JSON.stringify({
        "draw": req.body.draw,
        "recordsFiltered": recordsFiltered,
        "recordsTotal": recordsTotal,
        "data": results
    });
    return res.send(data);
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
           
            res.status(200).json({ "success": true, "message": "Grade status is updated successfully!" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}