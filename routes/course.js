const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');

const coursesController = require('../controllers/Admin/CoursesController')
router.get('/',  passport.checkAuthentication, coursesController.index);
router.get('/create', passport.checkAuthentication, coursesController.create);
router.get('/addCourses', passport.checkAuthentication, coursesController.addCourses);
router.get('/viewCourses', passport.checkAuthentication, coursesController.viewCourses);
router.get('/previewCourses', passport.checkAuthentication, coursesController.previewCourses);

module.exports = router;