const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../routes/users/models/User');
const bcrypt = require('bcryptjs');

// serialize and deserialize
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Middleware
passport.use(
  'local-login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return done(err, null);
        if (!user) {
          return done(
            null,
            false,
            req.flash('errors', 'No user has been found')
          );
        }

        bcrypt
          .compare(password, user.password)
          .then(result => {
            if (!result) {
              return done(
                null,
                false,
                req.flash('errors', 'Check email or password!')
              );
            } else {
              return done(null, user);
            }
          })
          .catch(error => {
            throw error;
          });
      });
    }
  )
);

//Don't need
// Custom function to validate
// exports.isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated) {
//     return next();
//   }
//   return res.redirect('/login');
// };
