const { body, validationResult } = require('express-validator');
const SubTopic = require('../../models/SubTopic');
const Topic = require('../../models/Topic');

var validateUser = () => [
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
      return Topic.find({ "_id": value })
        .then(category => {
          console.log(category);
          console.log(category.length);
          if (category.length == 0) {
            return Promise.reject('Select A Valid MainTopic!');
          }
        })
    })
    .bail(),
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('SubTopic Name can not be empty!')
    .bail()
    .isString()
    .withMessage('SubTopic Name should be a valid string!')
    .bail()
    .isLength({ min: 1, max: 1000 })
    .withMessage('SubTopic Name length is should be in a valid range!')
    .bail()
    .custom((value, { req }) => {
      console.log(value);
      return SubTopic.findOne({ "name": value, _id: { $ne: req.body.sub_topic_Id } })
        .then(SubTopic => {
          console.log(SubTopic);
          if (SubTopic != null) {
            return Promise.reject('SubTopic name is already in use!');
          }
        })
    })
    .bail(),
  body('note')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Note should be a valid string!')
    .bail(),
  body('status')
    .not()
    .isEmpty()
    .withMessage('The status can not be empty!')
    .bail()
    .isBoolean()
    .withMessage('Please select a valid status!')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

module.exports = validateUser();