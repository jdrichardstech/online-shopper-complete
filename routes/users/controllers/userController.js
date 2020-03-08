const User = require('../models/User');
const { validationResult } = require('express-validator');

module.exports = {
  register: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('errors', 'That user Already exists');
          return res.redirect('/api/users/register');
          // return res.status(500).json({ msg: 'User Already exists' });
        } else {
          const user = new User();
          user.profile.name = req.body.name;
          user.email = req.body.email;
          user.password = req.body.password;

          user
            .save()
            .then(user => {
              req.login(user, err => {
                if (err) {
                  res.status(400).json({ confirmation: false, message: err });
                } else {
                  next();
                }
              });
            })
            .catch(err => {
              return next(err);
            });
        }
      })
      .catch(err => {
        return next(err);
      });
  },
  updateProfile: (params, id) => {
    return new Promise((resolve, reject) => {
      User.findById(id)
        .then(user => {
          if (params.name) user.profile.name = params.name;
          if (params.email) user.email = params.email;
          if (params.address) user.address = params.address;
          return user;
        })
        .then(user => {
          user
            .save()
            .then(user => {
              resolve(user);
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
  // updateProfile: (req, res) => {
  //   return new Promise((resolve, reject) => {
  //     User.findById(id)
  //       .then(user => {
  //         if (params.name) user.profile.name = params.name;
  //         if (params.email) user.email = params.email;
  //         if (params.address) user.address = params.address;
  //         return user;
  //       })
  //       .then(user => {
  //         user
  //           .save()
  //           .then(user => {
  //             // resolve(user);
  //             res.redirect('/api/users/update-profile');
  //           })
  //           .catch(err => reject(err));
  //       })
  //       .catch(err => reject(err));
  //   });
  // }
};
