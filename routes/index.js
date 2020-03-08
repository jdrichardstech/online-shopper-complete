const express = require('express');
const router = express.Router();
const Product = require('../routes/admin/products/models/Product');

function paginate(req, res, next) {
  const perPage = 6;
  const page = req.params.pageNumber;
  Product.find()
    .skip(perPage * (page - 1))
    .limit(perPage)
    .populate('category')
    .exec((err, products) => {
      if (err) return next(err);
      Product.countDocuments().exec((err, count) => {
        if (err) return next(err);
        res.render('main/home-products', {
          products: products,
          pages: Math.ceil(count / perPage),
          page: Number(page)
        });
      });
    });
}

router.get('/', (req, res, next) => {
  if (req.user) {
    paginate(req, res, next);
  } else {
    res.render('main/home', {
      errors: req.flash('errors')
    });
  }
});
router.get('/home', (req, res, next) => {
  if (req.user) {
    paginate(req, res, next);
  } else {
    res.render('main/home', {
      errors: req.flash('errors')
    });
  }
});

router.get('/page/:pageNumber', (req, res, next) => {
  paginate(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  return res.redirect('/');
});

module.exports = router;
