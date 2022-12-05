const express = require('express');
const router = express.Router();
const passport = require('passport');
const studentsController = require('../controllers/Admin/StudentsController')

router.get('/', passport.checkAuthentication, studentsController.index);
router.get('/create', passport.checkAuthentication, studentsController.create);
router.post('/store', passport.checkAuthentication, studentsController.store);
router.get('/edit/:id', passport.checkAuthentication, studentsController.edit);
router.post('/update', passport.checkAuthentication, studentsController.update);
router.get('/destroy/:id', passport.checkAuthentication, studentsController.destroy);

module.exports = router;