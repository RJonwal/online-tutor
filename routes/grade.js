const express = require('express');
const router = express.Router();
const passport = require('passport');

const gradesController = require('../controllers/Admin/GradesController')

var storeGradeRequest = require('../requests/Grade/StoreGradeRequest');
var updateGradeRequest = require('../requests/Grade/UpdateGradeRequest');

router.get('/', passport.checkAuthentication, gradesController.index);
router.get('/create', passport.checkAuthentication, gradesController.create);
router.post('/store', passport.checkAuthentication, storeGradeRequest, gradesController.store);
router.get('/edit/:id', passport.checkAuthentication, gradesController.edit);
router.post('/update', passport.checkAuthentication, updateGradeRequest, gradesController.update);
router.get('/destroy/:id', passport.checkAuthentication, gradesController.destroy);
router.post('/update-status', passport.checkAuthentication, gradesController.updateStatus);

module.exports = router;