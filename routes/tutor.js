const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');
var multer = require('multer');

const tutorsController = require('../controllers/Admin/TutorsController')

var storeTutorRequest = require('../requests/Tutor/StoreTutorRequest');
var updateTutorRequest = require('../requests/Tutor/UpdateTutorRequest');


const storageProfileImage = multer.diskStorage({
    destination: (req, file, callback) => {
        const dir = './assets/ProfileImage/';
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

var uploadProfileImage = multer({
    storage: storageProfileImage,
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


router.get('/', passport.checkAuthentication, tutorsController.index);
router.get('/create', passport.checkAuthentication, tutorsController.create);
router.post('/store', passport.checkAuthentication, uploadProfileImage.single('profile_image'), storeTutorRequest, tutorsController.store);
router.get('/edit/:id', passport.checkAuthentication, tutorsController.edit);
router.post('/update', passport.checkAuthentication, uploadProfileImage.single('profile_image'), updateTutorRequest, tutorsController.update);
router.get('/destroy/:id', passport.checkAuthentication, tutorsController.destroy);

module.exports = router;