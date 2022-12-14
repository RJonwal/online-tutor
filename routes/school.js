const express = require('express');
const router = express.Router();
const passport = require('passport');
const schoolsController = require('../controllers/Admin/SchoolsController')

var storeSchoolRequest = require('../requests/School/StoreSchoolRequest');
var updateSchoolRequest = require('../requests/School/UpdateSchoolRequest');


router.get('/', passport.checkAuthentication, schoolsController.index);
router.post('/dataTable', passport.checkAuthentication, schoolsController.dataTable);
router.get('/create', passport.checkAuthentication, schoolsController.create);
router.post('/store', passport.checkAuthentication, storeSchoolRequest, schoolsController.store);
router.get('/edit/:id', passport.checkAuthentication, schoolsController.edit);
router.post('/update', passport.checkAuthentication, updateSchoolRequest, schoolsController.update);
router.get('/destroy/:id', passport.checkAuthentication, schoolsController.destroy);
router.post('/update-status', passport.checkAuthentication, schoolsController.updateStatus);

module.exports = router;