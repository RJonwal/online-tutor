const { body, validationResult } = require('express-validator');
const User = require('../../models/user');

var validateUser = () => [
    body('first_name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('First Name can not be empty!')
    .bail()
    .isString()
    .withMessage('First Name should be a valid string!')
    .bail()
    .isLength({ min: 1, max: 1000 })
    .withMessage('First Name length is should be in a valid range!')
    .bail(),
  body('last_name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Last Name can not be empty!')
    .bail()
    .isString()
    .withMessage('Last Name should be a valid string!')
    .bail()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Last Name length is should be in a valid range!')
    .bail(),
    body('grade')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Grade can not be empty!')
    .bail(),
  body('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Email can not be empty!')
    .bail()
    .isString()
    .withMessage('Email should be a valid string!')
    .bail()
    .isEmail()
    .withMessage('Input must be a valid email!')
    .bail()
    .custom((value, { req }) => {
      return User.findOne({ "email": value, _id: { $ne: req.body.student_id } })
        .then(student => {
          console.log(student);
          if (student != null) {
            return Promise.reject('Email is already in use!');
          }
        })
    })
  .bail(),
  body('phone')
    .not().isEmpty()
    .isInt()
    .withMessage('Phone no. should be valid number.')
    .trim()
    .bail()
    .custom((value, { req }) => {
      console.log(value);
      return User.findOne({ "dial_code": req.body.dial_code, "phone": value, _id: { $ne: req.body.student_id } })
        .then(student => {
          console.log(student);
          if (student != null) {
            return Promise.reject('Phone no. is already in use!');
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
  .withMessage('Select a valid status!')
  .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

module.exports = validateUser();