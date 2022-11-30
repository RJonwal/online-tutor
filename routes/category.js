const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');
var multer = require('multer');

const categoryController = require('../controllers/Admin/CategoryController')

var storeCategoryRequest = require('../requests/Category/StoreCategoryRequest');
var updateCategoryRequest = require('../requests/Category/UpdateCategoryRequest');

const storageCategoryImage = multer.diskStorage({
    destination: (req, file, callback) => {
        const dir = './assets/CategoryImage/';
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

var uploadCategoryImage = multer({
    storage: storageCategoryImage,
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


router.get('/', passport.checkAuthentication, categoryController.index);
router.get('/create', passport.checkAuthentication, categoryController.create);
router.post('/store', passport.checkAuthentication, uploadCategoryImage.single('category_image'), storeCategoryRequest, categoryController.store);
router.get('/edit/:id', passport.checkAuthentication, categoryController.edit);
router.post('/update', passport.checkAuthentication, uploadCategoryImage.single('category_image'), updateCategoryRequest, categoryController.update);
router.get('/destroy/:id', passport.checkAuthentication, categoryController.destroy);

module.exports = router;