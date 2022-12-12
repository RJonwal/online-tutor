const { body, validationResult } = require('express-validator');
const School = require('../../models/School');

var validateUser = () => [
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('School Name can not be empty!')
    .bail()
    .isString()
    .withMessage('School Name should be a valid string!')
    .bail()
    .isLength({ min: 1, max: 1000 })
    .withMessage('School Name length is should be in a valid range!')
    .bail()
    .custom((value, { req }) => {
      console.log(req.body);
      return School.findOne({ "name": value, _id: { $ne: req.body.school_id } })
        .then(school => {
          console.log(school);
          if (school != null) {
            return Promise.reject('School name is already in use!');
          }
        })
    })
    .bail(),
  body('phone')
    .optional({ checkFalsy: true })
    .not().isEmpty()
    .isInt()
    .withMessage('Phone no. should be valid number.')
    .trim()
    .bail()
    .custom((value, { req }) => {
      console.log(value);
      return School.findOne({ "dial_code": req.body.dial_code, "phone": value, _id: { $ne: req.body.school_id } })
        .then(school => {
          console.log(school);
          if (school != null) {
            return Promise.reject('School phone no. is already in use!');
          }
        })
    })
    .bail(),
  body('email')
    .optional({ checkFalsy: true })
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage('Email can not be empty!')
    .bail()
    .isEmail()
    .withMessage('Input must be a valid email!')
    .bail()
    .custom((value, { req }) => {
      console.log(req.body);
      return School.findOne({ "email": value, _id: { $ne: req.body.school_id } })
        .then(school => {
          console.log(school);
          if (school != null) {
            return Promise.reject('School email is already in use!');
          }
        })
    })
    .bail(),
  body('address')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Address should be a valid string!')
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