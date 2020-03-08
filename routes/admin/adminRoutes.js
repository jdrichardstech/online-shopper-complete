const router = require('express').Router();
const { validationResult } = require('express-validator');
const async = require('async');
const faker = require('faker');
const Category = require('./categories/models/Category');
const Product = require('./products/models/Product');
const categoryValidation = require('./categories/utils/categoryValidation');
const {
  getAllCategories,
  createCategory
} = require('./categories/controllers/categoryController');
const productController = require('./products/controllers/productController');

// Categories
router.get('/add-category', getAllCategories);

router.post('/add-category', categoryValidation, createCategory);

// router.get('/product/:name', (req, res, next) => {
//   Category.find({ name: req.params.name }, (err, cat) => {
//     if (err) next(err);
//     return console.log(cat);
//   });
// });

//Products

router.get('/add-products/:name', productController.addProducts);

module.exports = router;
