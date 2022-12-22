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
    updateStatus
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
 * list topic.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function index(req, res) {
    try {
        let topics = await Topic.find({}).sort({ '_id': -1 });

        let totalTopic  = await Topic.find({ "role": 2 }).sort({ '_id': -1 }).count();
        let activeTopic  = await Topic.find({ "status": 1  }  ).sort({ '_id': -1 }).count();
        let deactiveTopic = await Topic.find({ "status": 0  } ).sort({ '_id': -1 }).count();

        const TopicObject = {'total':totalTopic,'active':activeTopic,'deactive':deactiveTopic}

        return res.render('../views/admin/topics/index', { data: topics, fs: fs, moment: res.locals.moment,TopicObject:TopicObject });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * create topic.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function create(req, res) {
    try {
        return res.render('../views/admin/topics/create');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * store topic.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function store(req, res) {
    try {
        console.log(req.body);
        if (req.file != undefined) {
            req.body.topic_image = req.file.filename;
        } else {
            req.body.topic_image = '';
        }

        let topic = await Topic.create(req.body);
        req.flash('success', 'Topic created successfully!');
        if (topic) {
            res.status(200).json({ "success": true, "message": "Topic is created successfully!", "redirectUrl": "/topics" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "success": false, "message": "Something went wrong!" });
    }
}

/**
 * edit topic.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function edit(req, res) {
    try {
        let topicId = req.params.id;
        let topic = await Topic.find({ "_id": topicId });
        if (topic) {
            return res.render('../views/admin/topics/edit', { data: topic[0], fs: fs });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/**
 * update topic.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function update(req, res) {
    try {
        if (req.body.topic_id && req.body.topic_id != '') {
            let topic = await Topic.find({ "_id": req.body.topic_id });
            if (topic) {
                let slug = '';
                req.body.slug = slugify(req.body.name, slugify_options);
                if (req.file != undefined) {
                    topicData = topic[0];
                    let topicImage = topicData.topic_image;
                    const filePath = './assets/TopicImage/' + topicImage;
                    if (topicImage != '') {
                        fs.exists(filePath, function (exists) {
                            if (exists) {
                                fs.unlinkSync(filePath);
                            } else {
                                // console.log('File not found, so not deleting.');
                            }
                        });
                    }
                    req.body.topic_image = req.file.filename;
                    let topicUpdated = await Topic.findByIdAndUpdate(req.body.topic_id, req.body)

                } else {

                    if (req.body.is_remove == 1) {
                        let topic = await Topic.find({ "_id": req.body.topic_id });
                        if (req.file != undefined) {
                            topicData = topic[0];
                            let topicImage = topicData.topic_image;
                            const filePath = './assets/TopicImage/' + TopicImage;

                            if (topicImage != '') {
                                fs.exists(filePath, function (exists) {
                                    if (exists) {
                                        fs.unlinkSync(filePath);
                                    } else {
                                        // console.log('File not found, so not deleting.');
                                    }
                                });
                            }
                        }
                        let TopicUpdated = await Topic.updateOne({ "_id": req.body.topic_id }, {
                            $set:
                            {
                                name: req.body.name,
                                slug: req.body.slug,
                                topic_image: '',
                                note: req.body.note,
                                status: req.body.status
                            }
                        })

                    }
                    else {
                        let topicUpdated = await Topic.updateOne({ "_id": req.body.topic_id }, {
                            $set:
                            {
                                name: req.body.name,
                                slug: req.body.slug,
                                note: req.body.note,
                                status: req.body.status
                            }
                        })
                    }
                }
                req.flash('success', 'Topic updated successfully!');
                res.status(200).json({ "success": true, "message": "Topic is updated successfully!", "redirectUrl": "/topics" });
            }
        }
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
        searchStr = { $or: [{ 'first_name': regex }, { 'email': regex }, { 'phone': regex }] };
    }
    else {
        searchStr = {};
    }

    const filter = ['name', 'email', 'dial_code','address', 'status'];
    const column_name = filter[req.body.order[0].column];
    const order_by = req.body.order[0].dir;
    var recordsTotal = 0;
    var recordsFiltered = 0;
    let subject = await Topic.find({});
    recordsTotal    = await User.count({ "role": 2 });
    recordsFiltered = await  User.count({ $and: [{ "role": 2 }, obj, searchStr] });
    let results     = await  User.find({ $and: [{ "role": 2 }, obj, searchStr] }, '_id profile_image email first_name last_name dial_code phone subject_ids status', { 'skip': Number(req.body.start), 'limit': Number(req.body.length) }).sort({ [column_name]: order_by });
    var data = JSON.stringify({
        "draw": req.body.draw,
        "recordsFiltered": recordsFiltered,
        "recordsTotal": recordsTotal,
        "data": results
    });
    return res.send(data);
}

/**
 * delete topic.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function destroy(req, res) {
    try {
        let id = req.params.id;
        let topicDeleted = await Topic.findByIdAndDelete(id);
        if (topicDeleted) {
            let topicImage = topicDeleted.topic_image;
            if(topicImage != ''){
                const filePath = './assets/TopicImage/' + topicImage;
                fs.exists(filePath, function (exists) {
                    if (exists) {
                        fs.unlinkSync(filePath);
                    } else {
                        console.log('File not found, so not deleted.');
                    }
                });
            }
            
            req.flash('success', 'Topic is deleted successfully !');
        }
        return res.redirect('/topics');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}

/** 
 * update status of the topic.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateStatus(req, res) {
    try {
        if (req.body.uid && req.body.uid != '') {
            let status = ((req.body.status == 'true') ? '1' : '0');
            let topic = await Topic.findByIdAndUpdate(req.body.uid, { status: status });
        
            res.status(200).json({ "success": true, "message": "Topic status is updated successfully!" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}