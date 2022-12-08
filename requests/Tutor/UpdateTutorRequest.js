const { body, validationResult } = require('express-validator');
const User = require('../../models/user');

var validateUser = () => [
  body('title')
  .trim()
  .not()
  .isEmpty()
  .withMessage('Title  can not be empty!')
  .bail()
  .isString()
  .withMessage('Title should be a valid string!')
  .bail(),
  body('first_name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('First Name can not be empty!')
    .bail()
    .isString()
    .withMessage('First Name should be a valid string!')
    .bail()
    .isLength({ min: 5, max: 255 })
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
    .isLength({ min: 5, max: 255 })
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
      console.log(req.body);
      return User.findOne({ "email": value, _id: { $ne: req.body.tutor_id } })
        .then(user => {
          console.log(user);
          if (user != null) {
            return Promise.reject('Email is already in use!');
          }
        })
    })
    .bail(),
  body('password')
    .trim()
    .not()
    .bail()
    .isString()
    .withMessage('Password should be a valid string!')
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage('Password length is should be in a valid range!')
    .bail(),
  /* body('address')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Address can not be empty!')
    .bail()
    .isString()
    .withMessage('Address should be a valid string!')
    .bail()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Address length is should be in a valid range!')
    .bail(),
  body('calendar_color')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Calendar Color can not be empty!')
    .bail()
    .isString()
    .withMessage('Calendar Color should be a valid string!')
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage('Calendar Color is should be in a valid range!')
    .bail(),
  body('calendar_color')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Calendar Color can not be empty!')
    .bail()
    .isString()
    .withMessage('Calendar Color should be a valid string!')
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage('Calendar Color is should be in a valid range!')
    .bail(),
  body('note')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Address can not be empty!')
    .bail()
    .isString()
    .withMessage('Address should be a valid string!')
    .bail()
    .isLength({ min: 5, max: 10000 })
    .withMessage('Address length is should be in a valid range!')
    .bail(), */
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