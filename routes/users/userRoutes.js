const express = require('express');
const router = express.Router();
const User = require('./models/User');
const Product = require('../admin/products/models/Product');
const { register, updateProfile } = require('./controllers/userController');
const cartController = require('../cart/controllers/cartController');
const registerValidation = require('./utils/userValidation');
const passport = require('passport');
require('../../lib/passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.send('respond with a resource');
});

router.get('/register', (req, res) => {
  res.render('auth/register', { errors: req.flash('errors') });
});

router.post(
  '/register',
  registerValidation,
  register,
  cartController.createUserCart
);

router.get('/login', (req, res) => {
  // could also use
  // if(req.user)
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return res.render('auth/login', { errors: req.flash('errors') });
});

router.post(
  '/login',
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/api/users/login',
    failureFlash: true
  })
);

router.get('/profile', (req, res, next) => {
  console.log('AUTH:', req.isAuthenticated());
  if (req.isAuthenticated()) {
    User.findOne({ _id: req.user._id })
      .populate('history.item')
      .exec(function(err, foundUser) {
        console.log(foundUser.history[0].timestamp);
        if (err) return next(err);
        res.render('auth/profile', { user: foundUser });
      });
  }
  // User.findById({ _id: req.session.passport.user }) //wtf workaround if you don't figure it out
  //   .then(user => {
  //     // console.log(user);
  //     return res.render('auth/profile', { user: user });
  //   })

  // User.findById({ _id: req.user._id })
  //   .then(user => {
  //     res.render('auth/profile', { user: user });
  //   })
  //   .catch(err => {
  //     return next(err);
  //   });
});

router.get('/update-profile', (req, res) => {
  res.render('auth/update-profile');
});

// userController.updateProfile(req.body, req.user._id)

// router.put('/update-profile', (req, res, next) => {
//   User.findOne({ _id: req.user._id }, (err, user) => {
//     if (err) return next(err);

//     if (req.body.name) user.profile.name = req.body.name;
//     if (req.body.email) user.email = req.body.email;
//     if (req.body.address) user.address = req.body.address;
//     user.save(err => {
//       if (err) return next(err);
//       req.flash('success', 'Successfully updated profile');
//       return res.redirect('/api/users/profile');
//     });
//   });
// });

// // Does this also work? YES SO WHY THE OTHER params way?
// router.put('/update-profile', (req, res, next) => {
//   updateProfile(req.body, req.user._id)
//     .then(user => {
//       return res.redirect('/api/users/profile');
//     })
//     .catch(err => {
//       // req.flash('errors', 'User did not update');
//       return res.redirect('/api/users/update-profile');
//     });
// });

// Before controller
router.put('/update-profile', (req, res, next) => {
  return new Promise((resolve, reject) => {
    User.findById({ _id: req.user._id })
      .then(user => {
        if (req.body.name) user.profile.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.address) user.address = req.body.address;
        return user;
      })
      .then(user => {
        user
          .save()
          .then(user => {
            res.json({ user });
            // res.redirect('/api/users/profile');
            resolve(user);
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
});

// After controller
// router.put('/update-profile', (req, res, next) => {
//   updateProfile(req.body, req.user._id)
//     .then(user => {
//       return res.redirect('/api/users/profile');
//     })
//     .catch(err => {
//       // req.flash('errors', 'User did not update');
//       return res.redirect('/api/users/update-profile');
//     });
// });
module.exports = router;
