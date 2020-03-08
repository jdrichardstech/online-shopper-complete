const async = require('async');
const faker = require('faker');
const Category = require('../../categories/models/Category');
const Product = require('../models/Product');

module.exports = {
  addProducts: (req, res, next) => {
    async.waterfall([
      callback => {
        Category.findOne({ name: req.params.name }, (err, category) => {
          if (err) return next(err);
          console.log('CategoryName: ', category);
          callback(null, category);
        });
      },
      (category, callback) => {
        for (let i = 0; i < 24; i++) {
          const product = new Product();
          product.category = category._id;
          product.name = faker.commerce.productName();
          product.price = faker.commerce.price();
          product.image = `/images/products2/${i}.jpg`;
          product.description = faker.lorem.paragraph();

          product.save();
        }
      }
    ]);
    // res.json({ message: 'Success' });
    req.flash(
      'message',
      `Successfully added ${req.params.name.toUpperCase()} Category & products`
    );
    return res.redirect('/api/admin/add-category');
  }
};
