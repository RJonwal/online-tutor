const SubTopic = require('../../models/SubTopic');
const Topic = require('../../models/Topic');
const fs = require('fs');
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
    updateStatus,
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
 * list SubTopic.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let activeTopic = await Topic.find({ "status": 1 }).sort({ '_id': -1 });
        let subTopic = await SubTopic.find({}).populate('topic_id').sort({ '_id': -1 });
        console.log(subTopic);
        let totalSubTopic  = await SubTopic.find({ "role": 2 }).sort({ '_id': -1 }).count();
        let activeSubTopic  = await SubTopic.find({ "status": 1  }  ).sort({ '_id': -1 }).count();
        let deactiveSubTopic = await SubTopic.find({ "status": 0  } ).sort({ '_id': -1 }).count();

        const SubTopicObject = {'total':totalSubTopic,'active':activeSubTopic,'deactive':deactiveSubTopic}

        return res.render('../views/admin/subTopics/index', { data: subTopic, Topics: activeTopic, fs: fs, moment: res.locals.moment,SubTopicObject:SubTopicObject });
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
    if (req.body.sub_topic) {
        obj["_id"] = req.body.sub_topic;
    }
    if (req.body.main_topic) {
        obj["topic_id"] = req.body.main_topic;
    }
    if (req.body.status) {
        obj["status"] = req.body.status;
    }
    if (req.body.search.value) {
        var regex = new RegExp(req.body.search.value, "i")
        searchStr = { $or: [{ 'name': regex }] };
    }
    else {
        searchStr = {};
    }
    console.log(obj);
    const filter = ['name','topic_id','status'];
    const column_name = filter[req.body.order[0].column];
    const order_by = req.body.order[0].dir;
    var recordsTotal = 0;
    var recordsFiltered = 0;
    recordsTotal    = await SubTopic.count({});
    recordsFiltered = await SubTopic.count({ $and: [obj, searchStr] });
    let results     = await SubTopic.find({ $and: [obj, searchStr] }, '_id  name topic_id status', { 'skip': Number(req.body.start), 'limit': Number(req.body.length) }).populate('topic_id').sort({ [column_name]: order_by });
    var data = JSON.stringify({
        "draw": req.body.draw,
        "recordsFiltered": recordsFiltered,
        "recordsTotal": recordsTotal,
        "data": results
    });
    return res.send(data);
}

/**
 * create SubTopic.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        let activeTopic = await Topic.find({ "status": 1 }).sort({ '_id': -1 });
        return res.render('../views/admin/subTopics/create', { data: activeTopic });
    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * store SubTopic.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function store(req, res) {
    try {
        let subTopic = await SubTopic.create(req.body);
        req.flash('success', 'SubTopic created successfully!');
        if (subTopic) {
            res.status(200).json({ "success": true, "message": "SubTopic is created successfully!", "redirectUrl": "/subTopics" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
    }
}

/**
 * edit SubTopic.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function edit(req, res) {
    try {
        let subTopicId = req.params.id;
        let subTopic = await SubTopic.find({ "_id": subTopicId });
        let activeTopic = await Topic.find({ "status": 1 }).sort({ '_id': -1 });
        if (subTopic) {
            return res.render('../views/admin/subTopics/edit', { data: subTopic[0], allTopic: activeTopic, fs: fs });
        }
    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * update SubTopic.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function update(req, res) {
    try {
        if (req.body.sub_topic_Id && req.body.sub_topic_Id != '') {

            let subTopic = await SubTopic.find({ "_id": req.body.sub_topic_Id });
            if (subTopic) {
                subTopicData = subTopic[0];
                let slug = '';
                slug = slugify(req.body.name, slugify_options);

                let subTopicUpdated = await SubTopic.updateOne({ "_id": req.body.sub_topic_Id }, {
                    $set:
                    {
                        name: req.body.name,
                        slug: slug,
                        topic_id: req.body.topic_id,
                        note: req.body.note,
                        status: req.body.status
                    }
                })
            }
            req.flash('success', 'SubTopic updated successfully!');
            res.status(200).json({ "success": true, "message": "SubTopic is updated successfully!", "redirectUrl": "/subTopics" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
    }
}

/**
 * delete SubTopic.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function destroy(req, res) {
    try {
        let id = req.params.id;
        let subTopicDeleted = await SubTopic.findByIdAndDelete(id);
        if (subTopicDeleted) {
            req.flash('success', 'SubTopic is deleted successfully!');
        }
        return res.redirect('/subTopics');
    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/** 
 * update status of the SubTopic.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateStatus(req, res) {
    try {
        if (req.body.uid && req.body.uid != '') {
            let status = ((req.body.status == 'true') ? '1' : '0');
            let subTopic = await SubTopic.findByIdAndUpdate(req.body.uid, { status: status });
         
            res.status(200).json({ "success": true, "message": "SubTopic status is updated successfully!" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}