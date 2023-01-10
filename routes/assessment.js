const express = require('express');
const router = express.Router();
const passport = require('passport');

const assessmentController = require('../controllers/Admin/AssessmentController');

router.get('/', passport.checkAuthentication, assessmentController.index);
router.get('/create', passport.checkAuthentication, assessmentController.create);


module.exports = router;