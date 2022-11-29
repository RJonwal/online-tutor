const { body, validationResult } = require('express-validator');
const Category = require('../../models/Category');

var validateUser = () => [
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Category Name can not be empty!')
    .bail()
    .isString()
    .withMessage('Category Name should be a valid string!')
    .bail()
    .isLength({ min: 5, max: 255 })
    .withMessage('Category Name length is should be in a valid range!')
    .bail()
    .custom((value, { req }) => {
      console.log(value);
      return Category.find({ "name": value })
        .then(category => {
          console.log(category.length);
          if (category.length) {
            return Promise.reject('Category name is already in use!');
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