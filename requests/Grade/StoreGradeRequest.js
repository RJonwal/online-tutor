const { body, validationResult } = require('express-validator');
const Grade = require('../../models/grade');

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
      return Grade.find({ "name": value })
        .then(grade => {
          console.log(grade.length);
          if (grade.length) {
            return Promise.reject('Grade name is already in use!');
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