const express = require('express');
const db = require('../config/mongoose');
const router = express.Router();
console.log('router loaded');
router.use('/',require('./auth'));    // route added for auth
router.use('/dashboard',require('./dashboard'));    // route added for dashboard
router.use('/schools',require('./school'));    // route added for schools
router.use('/grades',require('./grade'));    // route added for grades
router.use('/topics',require('./topic'));    // route added for category
router.use('/subTopics',require('./subTopic'));    // route added for subCategory
router.use('/learning-content', require('./learningContent'));    // route added for learningContent
router.use('/students',require('./student'));    // route added for student
router.use('/tutors',require('./tutor'));    // route added for tutor
router.use('/assessments',require('./assessment'));    // route added for assessment

module.exports = router;