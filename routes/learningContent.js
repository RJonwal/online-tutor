const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');

const learningContentController = require('../controllers/Admin/LearningContentController')

router.get('/', passport.checkAuthentication, learningContentController.index);
router.get('/create', passport.checkAuthentication, learningContentController.create);
router.get('/viewCourses', passport.checkAuthentication, learningContentController.viewCourses);
router.get('/previewCourses', passport.checkAuthentication, learningContentController.previewCourses);

module.exports = router;