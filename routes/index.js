const express = require('express');
const db      = require('../config/mongoose');
const router  = express.Router();
console.log('router loaded');
router.use('/',require('./auth'));    // route added for auth
router.use('/dashboard',require('./dashboard'));    // route added for dashboard
router.use('/schools',require('./school'));    // route added for schools
router.use('/grade',require('./grade'));    // route added for grade
router.use('/categories',require('./category'));    // route added for grade
router.use('/subCategories',require('./subCategory'));    // route added for grade
router.use('/courses',require('./course'));    // route added for grade

module.exports = router;