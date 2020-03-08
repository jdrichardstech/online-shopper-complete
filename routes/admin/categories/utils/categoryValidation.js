const { check } = require('express-validator');

const categoryValidation = [
  check('name', 'Category name cannot be empty')
    .not()
    .isEmpty()
];

module.exports = categoryValidation;
