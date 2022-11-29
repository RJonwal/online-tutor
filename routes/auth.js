const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/Auth/AuthController')


router.get('/', authController.login);
router.get('/logout', authController.logout);
router.get('/forget-password', authController.forgetPassword);
router.post('/forget', authController.forget);
router.get('/reset-password', authController.resetPassword);
router.post('/verify-password', authController.verifyPassword);
router.post('/sign-in', passport.authenticate('local', { failureRedirect: '/', failureFlash: true },), authController.signIn);

module.exports = router;
