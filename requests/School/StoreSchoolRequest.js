const { body, validationResult } = require('express-validator');
const School = require('../../models/school');

var validateUser = () => [
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name can not be empty!')
    .bail()
    .isString()
    .withMessage('Name should be a valid string!')
    .bail()
    .isLength({ min: 5, max: 255 })
    .withMessage('Name length is should be in a valid range!')
    .bail()
    .custom((value, { req }) => {
      console.log(value);
      return School.find({ "name": value })
        .then(school => {
          console.log(school.length);
          if (school.length) {
            return Promise.reject('School name is already in use!');
          }
        })
    })
    .bail(),
  body('phone')
    .optional({ checkFalsy: true })
    .not().isEmpty()
    // .isLength({ min: 10, max: 10 })
    .withMessage('Phone no. length is should be 10 digits.')
    .isInt()
    .trim()
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
    .bail(),
  body('address')
    .optional({ checkFalsy: true })
    .isLength({ min: 5, max: 255 })
    .withMessage('Name length is should be in a valid range!')
    .bail(),
  body('status')
    .not()
    .isEmpty()
    .withMessage('status can not be empty!')
    .bail()
    .isBoolean()
    .withMessage('select a valid status')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

module.exports = validateUser();