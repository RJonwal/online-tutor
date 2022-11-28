const express = require('express');
const router = express.Router();
const passport = require('passport');
const GradeController = require('../controllers/admin/GradeController')

var storeGradeRequest = require('../requests/Grade/StoreGradeRequest');
var updateGradeRequest = require('../requests/Grade/UpdateGradeRequest');

router.get('/', passport.checkAuthentication, GradeController.index);
router.get('/create', passport.checkAuthentication, GradeController.create);
router.post('/store', passport.checkAuthentication, storeGradeRequest, GradeController.store);
router.get('/edit/:id', passport.checkAuthentication, GradeController.edit);
router.post('/update', passport.checkAuthentication, updateGradeRequest, GradeController.update);
router.get('/destroy/:id', passport.checkAuthentication, GradeController.destroy);

module.exports = router;