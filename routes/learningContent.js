const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');

const learningContentController = require('../controllers/Admin/LearningContentController')

router.get('/', passport.checkAuthentication, learningContentController.index);
router.get('/create', passport.checkAuthentication, learningContentController.create);
router.post('/store', passport.checkAuthentication, learningContentController.store);
router.get('/createOld', passport.checkAuthentication, learningContentController.createOld);
router.get('/viewCourses', passport.checkAuthentication, learningContentController.viewCourses);
router.get('/previewCourses', passport.checkAuthentication, learningContentController.previewCourses);
router.post('/renderSubtopic', passport.checkAuthentication, learningContentController.renderSubtopic);
router.get('/singleSelectText', passport.checkAuthentication, learningContentController.singleSelectText);
router.get('/singleSelectImage', passport.checkAuthentication, learningContentController.singleSelectImage);
router.get('/singleSelectText', passport.checkAuthentication, learningContentController.singleSelectText);
router.get('/singleSelectWithImage', passport.checkAuthentication, learningContentController.singleSelectWithImage);
router.get('/multipleSelectImage', passport.checkAuthentication, learningContentController.multipleSelectImage);
router.get('/multipleSelectWithImage', passport.checkAuthentication, learningContentController.multipleSelectWithImage);
router.get('/multipleSelectText', passport.checkAuthentication, learningContentController.multipleSelectText);

module.exports = router;