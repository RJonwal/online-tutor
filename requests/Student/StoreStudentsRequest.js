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
    .isLength({ min: 3, max: 255 })
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
    .isLength({ min: 3, max: 255 })
    .withMessage('Last Name length is should be in a valid range!')
    .bail(),
  body('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Email can not be empty!')
    .bail()
    .isEmail()
    .withMessage('Invalid email')
    .bail()
    .custom((value, { req }) => {
      console.log(value);
      return User.find({ "email": value })
        .then(user => {
          console.log(user.length);
          if (user.length) {
            return Promise.reject('Email is already in use!');
          }
        })
    })
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