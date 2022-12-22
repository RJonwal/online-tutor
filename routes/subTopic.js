const express = require('express');
const router = express.Router();
const passport = require('passport');

const subTopicController = require('../controllers/admin/SubTopicController')

var storeSubCategoryRequest = require('../requests/SubTopic/StoreSubTopicRequest');
var updateSubCategoryRequest = require('../requests/SubTopic/UpdateSubTopicRequest');


router.get('/', passport.checkAuthentication, subTopicController.index);
router.post('/dataTable', passport.checkAuthentication, subTopicController.dataTable);
router.get('/create', passport.checkAuthentication, subTopicController.create);
router.post('/store', passport.checkAuthentication, storeSubCategoryRequest, subTopicController.store);
router.get('/edit/:id', passport.checkAuthentication, subTopicController.edit);
router.post('/update', passport.checkAuthentication, updateSubCategoryRequest, subTopicController.update);
router.get('/destroy/:id', passport.checkAuthentication, subTopicController.destroy);
router.post('/update-status', passport.checkAuthentication, subTopicController.updateStatus);

module.exports = router;