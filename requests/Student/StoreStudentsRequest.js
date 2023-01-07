const { body, validationResult } = require('express-validator');
const User = require('../../models/user');
const Grade = require('../../models/Grade');
const School = require('../../models/School');

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
      return User.find({ "email": value })
        .then(student => {
          // console.log(student);
          // console.log(student.length);
          if (student.length) {
            return Promise.reject('Email is already in use!');
          }
        })
    })
    .bail(),
  body('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('password can not be empty!')
    .bail()
    .isString()
    .withMessage('password should be a valid string!')
    .bail()
    .isStrongPassword({ minLength: 8 }) //, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    .withMessage('password length should be 8 character!')
    .bail(),
  body('phone')
    .not().isEmpty()
    .isInt()
    .withMessage('Phone no. should be valid number.')
    .trim()
    .bail()
    .custom((value, { req }) => {
      console.log(value);
      return User.find({ "dial_code": req.body.dial_code, "phone": value })
        .then(student => {
          // console.log(student);
          // console.log(student.length);
          if (student.length) {
            return Promise.reject('Phone no. is already in use!');
          }
        })
    })
    .bail(),
  body('gender')
    .not()
    .isEmpty()
    .withMessage('The gender can not be empty!')
    .bail()
    .isBoolean()
    .withMessage('Select a valid gender!')
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
      console.log(value);
      return Grade.find({ "_id": value })
        .then(grade => {
          console.log(grade);
          console.log(grade.length);
          if (grade.length == 0) {
            return Promise.reject('Select A Valid Grade!');
          }
        })
    })
    .bail(),
  body('school_id')
    .trim()
    .not()
    .isEmpty()
    .withMessage('School can not be empty!')
    .bail()
    .isString()
    .withMessage('School should be a valid string!')
    .bail()
    .custom((value, { req }) => {
      console.log(value);
      return School.find({ "_id": value })
        .then(school => {
          console.log(school);
          console.log(school.length);
          if (school.length == 0) {
            return Promise.reject('Select A Valid School!');
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