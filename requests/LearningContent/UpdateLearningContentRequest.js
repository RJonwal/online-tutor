const { body, validationResult } = require('express-validator');
const Grade = require('../../models/Grade');
const Topic = require('../../models/Topic');
const SubTopic = require('../../models/SubTopic');
const LearningContent = require('../../models/LearningContent');
const Lesson = require('../../models/Lesson');

var validateUser = () => [
  body('title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Content title can not be empty!')
    .bail()
    .isString()
    .withMessage('Content title should be a valid string!')
    .bail()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content title length is should be in a valid range!')
    .bail()
    .custom((value, { req }) => {
      return LearningContent.findOne({ "title": value, _id: { $ne: req.body.learning_content_id } })
        .then(learningContent => {
          if (learningContent != null) {
            return Promise.reject('Content title is already in use!');
          }
        })
    })
    .bail(),
  body('grade_id')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Grade can not be empty!')
    .bail()
    .isString()
    .withMessage('Grade should be a valid string!')
    .bail()
    .custom((value, { req }) => {
      return Grade.find({ "_id": value })
        .then(grade => {
          if (grade.length == 0) {
            return Promise.reject('Please select a valid grade!');
          }
        })
    })
    .bail(),
  body('topic_id')
    .trim()
    .not()
    .isEmpty()
    .withMessage('MainTopic is required!')
    .bail()
    .isString()
    .withMessage('MainTopic should be a valid string!')
    .bail()
    .custom((value, { req }) => {
      console.log(value);
      return Topic.find({ "_id": value })
        .then(topic => {
          console.log(topic);
          console.log(topic.length);
          if (topic.length == 0) {
            return Promise.reject('Please select a valid MainTopic!');
          }
        })
    })
    .bail(),
  body('short_description')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Content description can not be empty!')
    .bail()
    .isString()
    .withMessage('Content description should be a valid string!')
    .bail()
    .isLength({ min: 1, max: 50000 })
    .withMessage('Content description length is should be in a valid range!')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

module.exports = validateUser();