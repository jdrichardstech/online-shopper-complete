const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const methodOverride = require('method-override');
require('dotenv').config();
const MongoStore = require('connect-mongo')(session);
const expressValidator = require('express-validator');
const flash = require('connect-flash');
require('./lib/passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users/userRoutes');
const adminRouter = require('./routes/admin/adminRoutes');
const productsRouter = require('./routes/admin/products/productRoutes');
const cartRouter = require('./routes/cart/cartRoutes');

const getAllCategories = require('./routes/admin/categories/middleware/getAllCategories');
const cartMiddleware = require('./routes/cart/middleware/cartMiddleware');
const app = express();

//add database
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(`MongoDB Error: ${err}`));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(flash());

app.use(getAllCategories);

app.use(methodOverride('_method'));

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      url: process.env.MONGODB_URI,
      autoReconnect: true,
      cookie: { maxAge: 60000 }
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;

  res.locals.errors = req.flash('errors');
  res.locals.message = req.flash('message');
  res.locals.success = req.flash('success');
  // res.locals.loginMessage = req.flash('loginMessage');
  // res.locals.errorValidate = req.flash('errorValidate');

  next();
});

// TEST SESSION COOKIE
// app.get('/cookie', function(req, res, next) {
//   req.session.name = 'JD';
//   console.log('Session: ', req.session);
//   if (req.session.views) {
//     req.session.views++;
//     res.setHeader('Content-Type', 'text/html');
//     res.write(`<h1>Hi ${req.session.name}</h1>`);
//     res.write('<p>views: ' + req.session.views + '</p>');
//     res.write('<p>expires in: ' + req.session.cookie.maxAge / 1000 + 's</p>');
//     res.end();
//   } else {
//     req.session.views = 1;
//     res.end('welcome to the session demo. refresh!');
//   }
// });

//add express validator ??? dunno how this works
// app.use(
//   expressValidator({
//     errorFormatter: (param, message, value) => {
//       let namespace = param.split('.');
//       let root = namespace.shift();
//       let formParam = root;

//       while (namespace.length) {
//         formParam += '[' + namespace.shift() + ']';
//       }

//       return {
//         param: formParam,
//         message: message,
//         value: value
//       };
//     }
//   })
// );
app.use(cartMiddleware);
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
