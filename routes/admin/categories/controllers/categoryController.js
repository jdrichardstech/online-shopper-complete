const Category = require('../models/Category');
const { validationResult } = require('express-validator');

module.exports = {
  getAllCategories: (req, res, next) => {
    res.render('admin/add-category', {
      success: req.flash('message'),
      errors: req.flash('err')
    });
  },
  createCategory: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);

      return res.status(422).json({ errors: errors.array() });
      //   return res.redirect('/api/admin/add-category');  // req.flash not working so we are doing the status thing.
    }

    const category = new Category();
    category.name = req.body.name;
    category
      .save()
      .then(category => {
        console.log(category);
        //maybe for today
        return res.status(200).json({ message: 'Category added', category });
        // try if you dare
        // req.flash('message', 'Successfully added a category');
        return res.redirect(`/api/admin/add-products/${category.name}`);
        // add the one below later when you want to make the category auto add products
        //return res.redirect(`/create/${category.name}`);
      })
      .catch(err => {
        if (err.code === 11000) {
          req.flash('err', 'Category already exists');
          return res.redirect('/api/admin/add-category');
        } else {
          return next(err);
        }
      });
  }
};
