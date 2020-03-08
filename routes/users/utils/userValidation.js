const { check } = require('express-validator');

const userValidation = [
  check('name', 'Name is required')
    .not()
    .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please include a valid password with a length of 6 characters'
  ).isLength({ min: 6 })
];

module.exports = userValidation;
