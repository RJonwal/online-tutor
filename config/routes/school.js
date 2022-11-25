const express           = require('express');
const router            = express.Router();
const passport          = require('passport');
const schoolController  = require('../controllers/school_controller')

router.get('/',passport.checkAuthentication,schoolController.addSchool);
router.post('/create',passport.checkAuthentication,schoolController.createSchool);
router.get('/destroy/:id',passport.checkAuthentication,schoolController.destroySchool);

module.exports = router;