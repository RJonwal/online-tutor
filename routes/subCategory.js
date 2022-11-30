const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');

const subCategoryController = require('../controllers/Admin/SubCategoryController')

var storeSubCategoryRequest = require('../requests/SubCategory/StoreSubCategoryRequest');
var updateSubCategoryRequest = require('../requests/SubCategory/UpdateSubCategoryRequest');


router.get('/', passport.checkAuthentication, subCategoryController.index);
router.get('/create', passport.checkAuthentication, subCategoryController.create);
router.post('/store', passport.checkAuthentication, storeSubCategoryRequest, subCategoryController.store);
router.get('/edit/:id', passport.checkAuthentication, subCategoryController.edit);
router.post('/update', passport.checkAuthentication, updateSubCategoryRequest, subCategoryController.update);
router.get('/destroy/:id', passport.checkAuthentication, subCategoryController.destroy);

module.exports = router;