const express         = require('express');
const router          = express.Router();
const passport        = require('passport');
const userController  = require('../controllers/user_controller')

router.get('/',userController.login);
//router.post('/signin',userController.signin);
router.get('/dashboard',passport.checkAuthentication,userController.dashboard);
router.get('/logout',userController.logout);

router.post('/signin', passport.authenticate('local', {failureRedirect: '/', failureFlash : true },), userController.signin);

module.exports = router;