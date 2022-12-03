const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');

const coursesController = require('../controllers/Admin/CoursesController')
router.get('/',  passport.checkAuthentication, coursesController.index);
router.get('/create', passport.checkAuthentication, coursesController.create);


module.exports = router;