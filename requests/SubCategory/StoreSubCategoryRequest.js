const { body, validationResult } = require('express-validator');
const SubCategory = require('../../models/SubCategory');

var validateUser = () => [
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('SubCategory Name can not be empty!')
    .bail()
    .isString()
    .withMessage('SubCategory Name should be a valid string!')
    .bail()
    .isLength({ min: 5, max: 255 })
    .withMessage('SubCategory Name length is should be in a valid range!')
    .bail()
    .custom((value, { req }) => {
      console.log(value);
      return SubCategory.find({ "name": value })
        .then(subCategory => {
          console.log(subCategory.length);
          if (subCategory.length) {
            return Promise.reject('SubCategory name is already in use!');
          }
        })
    })
    .bail(),
  body('note')
    .optional({ checkFalsy: true })
    .isLength({ min: 5, max: 255 })
    .withMessage('Note is should be in a valid range!')
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