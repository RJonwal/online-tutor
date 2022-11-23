const express         = require('express');
const router          = express.Router();
const passport        = require('passport');
const authController  = require('../controllers/auth/auth_controller')

router.get('/',authController.login);
router.get('/logout',authController.logout);
router.get('/forget-password',authController.forgetPassword);
router.post('/forget',authController.forget);
router.get('/reset-password',authController.resetPassword);
router.post('/verify-password',authController.verifyPassword);
router.post('/signin', passport.authenticate('local', {failureRedirect: '/', failureFlash : true },), authController.signin);

module.exports = router;
