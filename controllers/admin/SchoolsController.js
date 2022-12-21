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
        let schools = await School.find({}).sort({ '_id': -1 });

        let totalSchool  = await School.find({}).sort({ '_id': -1 }).count();
        let activeSchool  = await School.find( { "status": 1  } ).sort({ '_id': -1 }).count();
        let deactiveSchool  = await School.find( { "status": 0  }  ).sort({ '_id': -1 }).count();

        const schoolObject = {'total':totalSchool,'active':activeSchool,'deactive':deactiveSchool}

        return res.render('../views/admin/schools/index', { data: schools, moment: res.locals.moment ,schoolObject:schoolObject});
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
    flag = false;
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