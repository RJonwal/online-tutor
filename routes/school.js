const express           = require('express');
const router            = express.Router();
const passport          = require('passport');
const SchoolsController = require('../controllers/admin/SchoolsController')

router.get('/',passport.checkAuthentication,SchoolsController.index);
router.get('/create',passport.checkAuthentication,SchoolsController.create);
router.post('/store',passport.checkAuthentication,SchoolsController.store);
router.get('/edit/:id',passport.checkAuthentication,SchoolsController.edit);
router.post('/update',passport.checkAuthentication,SchoolsController.update);
router.get('/destroy/:id',passport.checkAuthentication,SchoolsController.destroy);

module.exports = router;