const express = require('express');
const db      = require('../config/mongoose');
const router  = express.Router();
console.log('router loaded');
router.use('/',require('./auth'));    // route added for user
router.use('/user',require('./user'));    // route added for user
router.use('/schools',require('./school'));    // route added for user

module.exports = router;