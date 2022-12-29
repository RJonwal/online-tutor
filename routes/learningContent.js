const express = require('express');
const multer = require('multer');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');

const learningContentController = require('../controllers/Admin/LearningContentController')

const storageContentImg = multer.diskStorage({
    destination: (req, file, callback) => {
        const dir = './assets/LearningContent/';
        if (!fs.existsSync(dir)) {
            fs.mkdir(dir, err => callback(err, dir));
        }

        const myContent = './assets/LearningContent/' + req.body.title;
        if (!fs.existsSync(myContent)) {
            fs.mkdir(myContent, err => callback(err, myContent));
        }

        let i = 1;
        if (req.body['outer-list']) {

            for (lessons of req.body['outer-list']) {
                let lesson_name = myContent + '/' + lessons.lesson_name;
                if (!fs.existsSync(lesson_name)) {
                    fs.mkdir(lesson_name, err => callback(err, lesson_name));
                }
                for (content of lessons['inner-list']) {
                    let slides = lesson_name + '/slides';
                    let practices = lesson_name + '/practices';
                    let challenges = lesson_name + '/challenges';

                    if (!fs.existsSync(slides)) {
                        fs.mkdir(slides, err => callback(err, slides));
                    }
                    if (!fs.existsSync(practices)) {
                        fs.mkdir(practices, err => callback(err, practices));
                    }
                    if (!fs.existsSync(challenges)) {
                        fs.mkdir(challenges, err => callback(err, challenges));
                    }

                }
                // let dir3 = './assets/LearningContent/Lession-' + i + '/' + 'Information Slide';
                // if (!fs.existsSync(dir3)) {
                //     fs.mkdir(dir3, err => callback(err, dir3));
                // }
            }
        }
        callback(null, dir);
    },
    filename: (req, file, callback) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        const newFileName = Date.now() + fileName;
        callback(null, newFileName);
    }
});
console.log('case1');
var uploadContentImgImage = multer({
    storage: storageContentImg,
    fileFilter: (req, file, callback) => {


        // if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        //     callback(null, true);
        // }
        // else {
        //     callback(null, false);
        //     return callback(new Error('Only .png, .jpg and .jpeg format allowed!'));
        // }
        callback(null, true);
    }
});


router.get('/', passport.checkAuthentication, learningContentController.index);
router.get('/create', passport.checkAuthentication, learningContentController.create);
router.post('/store', passport.checkAuthentication, uploadContentImgImage.any(), learningContentController.store);
router.get('/createOld', passport.checkAuthentication, learningContentController.createOld);
router.get('/viewCourses', passport.checkAuthentication, learningContentController.viewCourses);
router.get('/previewCourses', passport.checkAuthentication, learningContentController.previewCourses);
router.post('/renderSubtopic', passport.checkAuthentication, learningContentController.renderSubtopic);
router.get('/singleSelectText', passport.checkAuthentication, learningContentController.singleSelectText);
router.get('/singleSelectImage', passport.checkAuthentication, learningContentController.singleSelectImage);
router.get('/singleSelectText', passport.checkAuthentication, learningContentController.singleSelectText);
router.get('/singleSelectWithImage', passport.checkAuthentication, learningContentController.singleSelectWithImage);
router.get('/multipleSelectImage', passport.checkAuthentication, learningContentController.multipleSelectImage);
router.get('/multipleSelectWithImage', passport.checkAuthentication, learningContentController.multipleSelectWithImage);
router.get('/multipleSelectText', passport.checkAuthentication, learningContentController.multipleSelectText);

module.exports = router;