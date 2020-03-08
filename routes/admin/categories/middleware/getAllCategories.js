const Category = require('../models/Category');

const getAllCategories = (req, res, next) => {
  Category.find({}, (err, categories) => {
    if (err) return next(err);

    //mabye add this after you add to the navbar dropdown?
    res.locals.categories = categories;
    next();
  });
};

module.exports = getAllCategories;
