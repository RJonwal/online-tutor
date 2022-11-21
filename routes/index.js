const express = require('express');
const db      = require('../config/mongoose');
const router  = express.Router();
console.log('router loaded');
router.use('/',require('./user'));    // route added for user
module.exports = router;