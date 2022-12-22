const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');
var multer = require('multer');

const topicController = require('../controllers/admin/TopicController')

var storeTopicRequest = require('../requests/Topic/StoreTopicRequest');
var updateTopicRequest = require('../requests/Topic/UpdateTopicRequest');

const storageTopicImage = multer.diskStorage({
    destination: (req, file, callback) => {
        const dir = './assets/TopicImage/';
        if (!fs.existsSync(dir)) {
            fs.mkdir(dir, err => callback(err, dir));
        }
        callback(null, dir);
    },
    filename: (req, file, callback) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        const newFileName = Date.now() + fileName;
        callback(null, newFileName);
    }
});

var uploadTopicImage = multer({
    storage: storageTopicImage,
    fileFilter: (req, file, callback) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            callback(null, true);
        }
        else {
            callback(null, false);
            return callback(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.get('/', passport.checkAuthentication, topicController.index);
router.post('/dataTable', passport.checkAuthentication, topicController.dataTable);
router.get('/create', passport.checkAuthentication, topicController.create);
router.post('/store', passport.checkAuthentication, uploadTopicImage.single('topic_image'), storeTopicRequest, topicController.store);
router.get('/edit/:id', passport.checkAuthentication, topicController.edit);
router.post('/update', passport.checkAuthentication, uploadTopicImage.single('topic_image'), updateTopicRequest, topicController.update);
router.get('/destroy/:id', passport.checkAuthentication, topicController.destroy);
router.post('/update-status', passport.checkAuthentication, topicController.updateStatus);

module.exports = router;