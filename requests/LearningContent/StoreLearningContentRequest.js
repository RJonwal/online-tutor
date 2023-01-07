const { body, validationResult } = require('express-validator');
const Grade = require('../../models/Grade');

var validateUser = () => [
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Grade Name can not be empty!')
    .bail()
    .isString()
    .withMessage('Grade Name should be a valid string!')
    .bail()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Grade Name length is should be in a valid range!')
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