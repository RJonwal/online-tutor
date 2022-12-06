const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');
var multer = require('multer');

const studentsController = require('../controllers/Admin/StudentsController')

const storageProfileImg = multer.diskStorage({
    destination: (req, file, callback) => {
        const dir = './assets/ProfileImage/';
        if(!fs.existsSync(dir)){
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

var uploadProfileImgImage = multer({
    storage: storageProfileImg,
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

router.get('/', passport.checkAuthentication, studentsController.index);
router.get('/create', passport.checkAuthentication, studentsController.create);
router.post('/store', passport.checkAuthentication, uploadProfileImgImage.single('profile_image'),studentsController.store);
router.get('/edit/:id', passport.checkAuthentication, studentsController.edit);
router.post('/update', passport.checkAuthentication,uploadProfileImgImage.single('profile_image'), studentsController.update);
router.get('/destroy/:id', passport.checkAuthentication, studentsController.destroy);

module.exports = router;