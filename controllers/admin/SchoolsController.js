const School = require('../../models/School');
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
 * list school. 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let schools = await School.find({ "status": 1  }).sort({ '_id': -1 }); 
        let totalSchool  = await School.find({}).sort({ '_id': -1 }).count();
        let activeSchool  = await School.find( { "status": 1  } ).sort({ '_id': -1 }).count();
        let deactiveSchool  = await School.find( { "status": 0  }  ).sort({ '_id': -1 }).count();

        const schoolObject = {'total':totalSchool,'active':activeSchool,'deactive':deactiveSchool}

        return res.render('../views/admin/schools/index', { schools: schools ,schoolObject:schoolObject});
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
    console.log(searchStr);
    const filter = ['name',  'email', 'dial_code','address','status'];
    const column_name = filter[req.body.order[0].column];
    const order_by = req.body.order[0].dir;
    console.log(column_name,order_by);
    var recordsTotal = 0;
    var recordsFiltered = 0;
    recordsTotal    = await School.count({ "role": 3 });
    recordsFiltered = await  School.count({ $and: [{ "role": 3 }, obj, searchStr] });
    let results     = await  School.find({ $and: [{ "role": 3 }, obj, searchStr] }, '_id name email dial_code phone address status', { 'skip': Number(req.body.start), 'limit': Number(req.body.length) }).sort({ [column_name]: order_by });
    var data = JSON.stringify({
        "draw": req.body.draw,
        "recordsFiltered": recordsFiltered,
        "recordsTotal": recordsTotal,
        "data": results
    });
    return res.send(data);
}


/**
 * create school.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        return res.render('../views/admin/schools/create');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * store school.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function store(req, res) {
    try {
        let school = await School.create(req.body);
        if (school) {
            res.status(200).json({ "success": true, "message": "School is created successfully!", "redirectUrl": "/schools" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
    }
}

/**
 * edit school.
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
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * update school.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function update(req, res) {
    try {
        if (req.body.school_id && req.body.school_id != '') {
            let school = await School.findByIdAndUpdate(req.body.school_id, req.body)
            res.status(200).json({ "success": true, "message": "School is updated successfully!", "redirectUrl": "/schools" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
    }
}

/**
 * delete school.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function destroy(req, res) {
    try {
        let id = req.params.id;
        let schoolDeleted = await School.findByIdAndDelete(id);
        if (schoolDeleted) {
            req.flash('success', 'School is deleted successfully!');
        }
        return res.redirect('/schools');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/** 
 * update status of the school.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateStatus(req, res) {
    try {
        if (req.body.uid && req.body.uid != '') {
            let status = ((req.body.status == 'true') ? '1' : '0');
            let school = await School.findByIdAndUpdate(req.body.uid, { status: status });
          
            res.status(200).json({ "success": true, "message": "School status is updated successfully!" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}