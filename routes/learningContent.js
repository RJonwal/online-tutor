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
        let i=1;
        if(req.body['outer-list']){
            let dir1 = './assets/LearningContent/lession-'+i;
            let dir2 = './assets/LearningContent/lession-'+i+'/lession-name';
            if (!fs.existsSync(dir1)) {
                fs.mkdir(dir1, err => callback(err, dir1));
            }
            if (!fs.existsSync(dir2)) {
                fs.mkdir(dir2, err => callback(err, dir2));
            }
            for(filesData of req.body['outer-list']){
                let dir3 = './assets/LearningContent/lession-'+i+'/lession-name/'+'slide';
                if (!fs.existsSync(dir3)) {
                    fs.mkdir(dir3, err => callback(err, dir3));
                }
                console.log(filesData);
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
router.post('/store', passport.checkAuthentication, uploadContentImgImage.any(),learningContentController.store);
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