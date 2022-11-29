const express         = require('express');
const router          = express.Router();
const passport        = require('passport');
const dashboardController  = require('../controllers/Admin/DashboardController')

router.get('/',passport.checkAuthentication,dashboardController.dashboard);

module.exports = router;