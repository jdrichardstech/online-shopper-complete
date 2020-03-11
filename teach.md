1. npx express-generator online-shopper --ejs
2. change var to const
3. Quick test server
   a. Let's also go to the bin/www file and add a message showing what port we are listening on
   b. Add a callback to server.listen to say we are listening on port 3000 locally;
   c. Explain that heroku or wherever we deploy will choose its own port which is why we also use the process.env.PORT as first choice
4. Add .prettierrc and .gitignore
5. Fix prettier file
6. Gigignore add node_modules, .env....
7. Go through everything that is going on in the files, app.js, routes, morgan
8. Ask them about different things in the app to make sure
9. `npm i -s mongoose bcryptjs dotenv`
   `npm i -D nodemon` if not installed globally on machines
10. Add mongoose and dotenv to the app.js

```
    mongoose
     .connect(process.env.MONGODB_URI, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex: true
     })
     .then(() => console.log('MongoDB Connected'))
     .catch(err => console.log(`MongoDB Error: ${err}`));

```

11. Add to your .env file `MONGODB_URI = 'mongodb://localhost/online-shopper-trial'`
    \*\*\* IF THEY DON'T KNOW, EXPLAIN process.env
    Process is the global on the Node object the way Window is available to us globally on the DOM.
12. Create models folder and a User model
13. In User.js model Import mongoose and bcrypt
14. Explain that this time we are going to hash the password before it is put into the database
15. .pre is a method for a middleware that will do things before the information is put into the database. In this instance
    we put the hashed password into the db instead of exposing the actual password.
16. 'this' in the .pre code is pointing the this to the new instance when it is created of the UserSchema object
17. First we check to see if the user password is modified. Look at User.js to type this out
18. If it is not modified we use bcrypt and salt the password
19. Now lets make sure we export our model
20. Introduce Postman and install it if we have never installed it?
21. Let's create a route to test our Schema
    a. in the app.js file create

    ```
       app.post('/register', (req, res, next) => {
           res.json('App registered')
       }
    ```

    b. Test it in postman. You should see it down at the bottom
    c. Next lets change the code to:

    ```
        app.post('/register', (req, res, next) => {
        const user = new User();
        user.profile.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;

        user.save(err => {
            if (err) return next(err);
            return res.status(200).json({ message: 'success', user });
        });
        });
    ```

    d. Notice what you get back in your postman console.
    e. Lets also open up Robo 3T and see if we have a user - DB -> Collections -> users
    f. Now have the class create a users folder inside routes and change users.js to userRoutes.js and move it into the folder
    g. If the middleware in app.js didn't change it for you you need to change the routing for the routes as well.
    h. Have the class move the app.post to the userRoutes.js and fix it accordingly
    i. remember to move the User Model import to the route instead of app.js
    j. test again in postman by adding another user
    k. check Robo 3T

22. Lets restructuere our app.
23. Inside the users folder lets create a controllers and a models folder
24. Explain that as Express is an unopinionated framework, for this project we are go to bundle our models controllers and routes in a targeted folder based on subject
25. Move the models folder inside the routes/users folder
26. Now fix your imports. Sometimes it may throw an error because it takes a moment to connect the dots. Sometimes you may need to re-save the file.
27. chane our userRoute to bring in the controller
28. now let's test
29. Now we need to accomodate for the fact that there may be a user in the database. so lets do that in our usercontroller register function

```
    register: (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          return res.status(500).json({ msg: 'User Already exists' });
        } else {
          const user = new User();
          user.profile.name = req.body.name;
          user.email = req.body.email;
          user.password = req.body.password;

          user.save(err => {
            if (err) return next(err);
            return res.status(200).json({ message: 'success', user });
          });
        }
      })
      .catch(err => {
        return next(err);
      });
  }
```

30. test with same input from before. Now test with new import to make sure of functionality
31. Now lets install express validator `npm i express-validator`
32. Explain express validator if you haven't before and go to the website and git
33. Bring it into the userRoute :
    a. `const { check, validationResult } = require("express-validator");`
    b. along with this between between route and callback in userRoute:
    ```
        [
            check('name', 'Name is required')
            .not()
            .isEmpty(),
            check('email', 'Please include a valid email').isEmail(),
            check('password', 'Please include a valid email').isLength({ min: 6 })
        ],
    ```
34. In userController :
    a.import `const { check, validationResult } = require("express-validator");`
    b. and add: (status 422 is in the documentation)
    ```
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }
    ```
35. Restart your node to be safe and test by making empty strings of name, then email, then password
36. Now let's extract that check functionality into its own file so as not to muck up the code
37. Create a utils folder (shor for utilities) and a file called userValidation.js
38. Create a function expression called user validation and export it.
39. Now move the functionality from the userRoute...to the userVaildation file and export as an array
40. Next EJS. Give them assets.
    a. image folder send. explain that it is all grabbed from different places. Maybe explain bootsnipp and bootstrap again
    b. Show twitter bootstrap and have them put a few things on the page before giving them what the code will be.
    c. Now grab from the online-shopper-ejs app the home1.ejs file
    d. Teach partials and make partials of head, footer, scripts \*head. Show them includes. Also go to twitter bootstraps and show the scripts we are going to need and the order is important. With the head, make sure you don't take all of it because you want the title to be free and you want to be able to link proprietary css pages as well.
    e. Now for the css:
    1.  `<link rel="stylesheet" href="/stylesheets/home.css" type="text/css"/>`
    2.  Show them this line in app.js `app.use(express.static(path.join(__dirname, 'public')));`
    3.  Explain that this line allows us to access the static assets that are available inside the folder including stylesheets, images, and scripts
41. Next create an auth folder in the views and then a register.ejs page
42. How to give them the register.ejs page. Send and explain?
43. Is the css included on the page already if so show where the css is, if not explain and move the css by making a form.css page in the public/stylesheets
44. If they don't yet know then teach node-express-intro/node-passport
45. `npm i express-session connect-mongo connect-flash cookie-parser` Video Signup Part 3
46. import them into root index.js file
    a. const flash = require('connect-flash');
    b. const session = require('express-session');
    c. const MongoStore = require('connect-mongo')(session);
47. now we must set up the session middleware
    ```
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
    ```
48. Remember to add SESSION_SECRET to your .env `SESSION_SECRET='my-secret'`
49. Add test session code. Either type or slack this code. Add your name to the cookie to use in the test

    ```
        app.get('/cookie', function(req, res, next) {
        req.session.name = 'JD';
        console.log('Session: ', req.session);
        if (req.session.views) {
        req.session.views++;
        res.setHeader('Content-Type', 'text/html');
        res.write(`<h1>Hi ${req.session.name}</h1>`);
        res.write('<p>views: ' + req.session.views + '</p>');
        res.write('<p>expires in: ' + req.session.cookie.maxAge / 1000 + 's</p>');
        res.end();
        } else {
        req.session.views = 1;
        res.end('welcome to the session demo. refresh!');
        }
        });

    ```

    50. Test to make sure the session cookie work.
        a. add `app.use(cookieParser());` although we may no longer need it.
    51. Now comment out the code.
    52. Let's return to flash. We need flash to help with our success and error messages. Before we forget, lets
        make sure we include the flash middleware `app.use(flash())`
    53. We need to add flash to our register post route in the controller
    54. Reason flash is dependent on session and cookie is because the flash messages are saved as an array to be used
        on the request route
    55. Now go to user controller register post and replace our console.log User already exists with
        `req.flash('errors', 'User Already Exists')
    56. Go to the userRoute and choose the register get route and add the error that will be passed
        `res.render('auth/register', { errors: req.flash('errors') });`
    57. Then for now, got to your auth/register.ejs file and just above the form add
        `<% if(errors.length > 0){ %> <p><%= errors %> <% } %>`
    58. Let them know we will make this look better but for now we want to test it.
    59. Now add the bootstrap for the error. Explain the bootstrap and how it will show a red alert and create a button so we can close out the error

    ```
        <% if (errors.length > 0) { %>
          <div class ="alert alert-danger alert-dismissible">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
          <%=errors %>
          </div>
        <% } %>
    ```

    60. LOGIN-PASSPORT: Next we are going to create login. Let's start by adding passport for authentication
        If you haven't explained you will have to explain
    61. Now install
        `npm i passport passport-local`
    62. Add to your root file
        `const passport = require('passport');`
    63. Now add as middleware: \*\*\*THIS MUST GO AFTER THE SESSION MIDDLEWARE!!!!!!!


        `app.use(passport.initialize());`
        `app.use(passport.session());`


    64. Next we will create a separate passport module because we don't want our froot file to be so jammed up.
        `mdkir lib` in your route file
        `touch lib/passport.js`
    65. Here we are going to create our passport strategy. ...Video24... This will be pretty boilerplate based on the website itself.
    66. Start with our imports
        ```
            const passport = require('passport');
            const LocalStrategy = require('passport-local').Strategy;
            const User = require('../routes/users/models/User');
            const bcrypt = require('bcryptjs');

        ```
    67. Explain how we want to do 3 main things in this file
        a. Serialize and Deserialize `//serialize and deserialize`
        b. Create the middleware for passport `// Add middleware`


            ```
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

            ```
    68. Now we need to add new routes to the userRouter for login. One for get and one for post

    69. The get route is simple

    ```
        router.get('/login', (req, res) => {
        if (req.isAuthenticated) {
            return res.redirect('/');
        }
        return res.render('/api/users/login');
        });

    ```
    Passport gives us access to a function called isAuthenticated which checks to see if there is a user
    or a req.user. We could say if(req.user) but instead we will user the function

    70. In our post, we are going to use our passport.js middleware First let's bring in passport go the file where we will call our function userRoute.js
    `const passport = require('passport');`
    `require('../../lib/passport');`

    71. Next let's add our route:

    ```
        router.post(
        '/login',
        passport.authenticate('local-login', {
            successRedirect: '/api/users/profile',
            failureRedirect: '/api/users/login',
            failureFlash: true
        })
        );

    ```
    72. Let's now go to postman and test our login route
        a. First check for failure. When it fails we should get an error of some type because the acutal login page
        does not exist
        b. Now let's test for success
    73. Now let's create a login page in our ejs
    74. Simply copy your register.ejs page and then paste into login.ejs
        a. Change title to Login-Online Shopper
        b. Change the paths and all the refers to Register to Login etc.
        c. Lots to change so be thorough.
        d. Also remember to change paths in Register to hookup to login
    75. Test the route to see if it works
    76. Let's hook up our req.flash
        a. go back to passport and add req.flash to this area and just and the req.flash part:
        ```
             User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return done(err, null);
        if (!user) {
          return done(
            null,
            false,
            req.flash('errors', 'No user has been found')
          );
        }

        ```
        b. hook up req.flash also to
        ```
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

        ```


    77. Go to your userRoute login get route and add to unsuccessful part
    ` return res.render('auth/login', { errors: req.flash('errors') });`

    78. Now test in your browser your login page
    79. So we want to add a hello and our name to the nav bar when we are logged in.
    80. First we need to add a middleware that gives us access to req.user in our views. We could send the req.user to each route individually but that is redundant and is not DRY. Here's how we can place it so that we have access in every view:

    ```
    app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
    });

    ```

    81. This will allow us to use the user in any of our views when they are authenticated
    82. Let's go to the nav partial and add 'Hi' and the user name, Also while we are at it, we don't want to see the Register and Login link if we are logged in.
    ```

         <% if(!user){ %>
            <span style="color:white; padding-left:20px"
            ><a style="color:white;" href="/register">Register</a>/<a
                style="color:white;"
                href="/login"
                >Login</a
            ></span
            >
        <% }else{ %>

            <span style="color:orange; padding:0 20px;"
            >Hello&nbsp;<a style="color:orange;" href="/profile">
                <%= user.profile.name.toUpperCase()%></a
            >
            &nbsp;</span
            >

            <span style="color:white;padding-left:10px;"
            ><a style="color:white;" href="/logout">Logout</a></span
            >
        <% }%>

    ```

    83. Next we need to do some major cleanup
        a. Our Register link in the navbar needs a route - THEY DO
        b. Our Login link needs a route
        c. We should create a logout route for the Logout link and so that we can test whether we are authenticated or not.
        d. Let's put the logout route in the index for now and redirect logout to the '/' which will show register login again.
        e. Now test and see that the functionality is happening
    84. Now if you check you will notice that if we REGISTER, it does not show the name . So we should fix that.
    85. Lets go to our USERCONTROLLER page.
    86. Now we need to use req.login from passport to login the user after they register. This will add a cookie to the session and a session to the browserr.
    87. Then we need to redirect to the main page with the name in the navbar

    ```
            user
            .save()
            .then(user => {
              req.login(user, err => {
                if (err) {
                  res.status(400).json({ confirmation: false, message: err });
                } else {
                  res.redirect('/');
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

    }
    };

    ```

88. Let's now add a profile page and route--THEY CREATE Let the page say hi and username
89. Give them the ejs for profile page. Or type it out based on the online-shopper page and tell them they can redesign this page if they want.
90. Build profile get route

```
    router.get('/profile', (req, res, next) => {
        console.log('AUTH:', req.isAuthenticated());
        if (req.isAuthenticated()) {
            res.render('auth/profile', { user: req.user });
        }
    });


```

91. Actually because of locals we don't need to send the user:req.user
92. Add the profile page
93. Now we need to create a route and page to edit the profile
94. Create a route to render the update-profile page and create a update profile page
95. Give them the code. Or type along online-shopper
96. Next we create the update profile routes

    ```
        router.get('/update-profile', (req, res) => {
            res.render('auth/update-profile');
        });
    ```

97. update-profile post explain each part

```
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

```

    ```
        router.post('/update-profile', (req, res, next) => {
            User.findOne({ _id: req.user._id }, (err, user) => {
                if (err) return next(err);

                if (req.body.name) user.profile.name = req.body.name;
                if (req.body.email) user.email = req.body.email;
                if (req.body.address) user.address = req.body.address;
                user.save(err => {
                if (err) return next(err);
                return res.redirect('/api/users/profile');
                });
            });
        });

    ```

98. Test routes
99. Now we need to introduce `npm method-override` https://dev.to/moz5691/method-override-for-put-and-delete-in-html-3fp2
100.  html `<form>` does not support Put and Delete. So we have to use another package in order to add them to our ejs form and route
101.  Download the package
102.  Add it to the root file `const methodOverride = require('method-override')
103.  Now we need to add it as a middleware and give it the query name we will use in the ejs form. It's typical to use \_method as the query name.
      `app.use(methodOverride('\_method'));`
104.  Next we need to switch our post route for update-profile to a put route
105.  Then we go to our update-profile.ejs and we need to change our form action. We leave the original method as
      POST however the action will query for PUT
      `<form role="form" method="POST" action="/api/users/update-profile?_method=PUT">`
106.  Now let's test our update to see if it works.
107.  Let's move the update-profile functionality into a controller. LET THEM TRY.
108.  So we are going to have to do this a little differrently because we need to pass the user and the id to the controller plus we will need to make some changes.
109.  Name the function updateProfile. It will take a params to receive what we are going to send it and it will take the id the we will get from req.user to change the correct user.
110.  Slowly move the info. req.body from the route will have to be params. in the controller.
111.  Make promises between the find and the save.
112.  When you test it still won't work because we have no res. the res is in the router. So we need to return a promise so that we send a promise back to the route and then we can res.redirect to our path.
113.  Now I want everyone to copy this project and save this part of the project. We have created a full login which will be used on a lot of projects and will be redundant. So it is good to have a copy to understand before we add additional functionality.
114.  Now we are about to create categories that we will add as well as products that we will manually add to our categories so that we have items to choose from when we shop.
115.  We start by scaffolding the the structure for creating Categories and Products
      a. Create in our routes folder a folder called admin that will hold our products and categories creation since only admins would have access We will change so that we can create admins later vs. shoppers.
      b. Create in the folder a file called adminRoutes.js
      c. create a folder called models and a folder called controllers
      d. Also in our app.js we will have to bring in our adminRoutes and create a middleware (app.use) so that the app will use it. This will also be part of our api because, just because someone is an admin doesn't mean they need to see all of the functionality of the code.
116.  So I want you to create a model called Category.js which takes one property name which will be a string, it should be unique and lowercase.
117.  Go over it with them

```
    const mongoose = require('mongoose');

    const CategorySchema = new mongoose.Schema({
    name: { type: String, unique: true, lowercase: true }
    });

    module.exports = mongoose.model('Category', CategorySchema);


```

118. Now create a Model called Product.js give it a price which is a number and also a name, image and description...all strings.
119. Now we need our product to be specific to its category. To do that we have to use a special thing in mongoose Schema.Types.ObjectId. This connects the id from the category we have chosen to the product we create using the populate function from mongoose. Now we add category to our model like this:
     `category: { type: Schema.Types.ObjectId, ref: 'Category' },`
     SHOW them in the database, the id we are going to be grabbing and adding


    References:
     a. https://dev.to/mkilmer/how-create-relationships-with-mongoose-and-node-js-with-real-example-43ei
     b. https://zellwk.com/blog/mongoose-population/

120. Code should look like this:


    ```
        const mongoose = require('mongoose');
        const Schema = mongoose.Schema;

        const ProductSchema = new mongoose.Schema({
        category: { type: Schema.Types.ObjectId, ref: 'Category' },
        name: String,
        price: Number,
        image: String,
        description: String
        });

        module.exports = mongoose.model('Product', ProductSchema);

    ```

121.  Now we need to add ROUTES to both post and get a category.
122.  Let's go to adminRoutes.js and add a get route for the category cause it is the easiest
      a. Start with your imports:
      `const router = require('express').Router();`
      `const Category = require('./models/Category');`
      b. Next the get route:

      ```
          router.get('/add-category', (req, res, next) => {
          res.render('admin/add-category', {
          success: req.flash('message'),
          errors: req.flash('errors')

              });
          });

      ```

      c. Now the post route:

      ```
        router.post('/add-category', (req, res, next) => {
            const category = new Category();
            category.name = req.body.name;
            category
                .save()
                .then(category => {
                console.log(category);
                req.flash('message', 'Successfully added a category');
                return res.redirect(`/add-category`);
                // add the one below later when you want to make the category auto add products
                //return res.redirect(`/create/${category.name}`);
                })
                .catch(err => {
                if (err.code === 11000) {
                    req.flash('errors', 'Category already exists');
                    return res.redirect('/add-category');
                } else {
                    return next(err);
                }
                });
            });

      ```

123.  Let' remember to export our adminRoutes.js to our app.js file and create its middleware


    `const adminRouter = require('./routes/admin/adminRoutes');`
    `app.use('/api/admin', adminRouter);`
    and let's update our res.locals with
    ```
        res.locals.errors = req.flash('errors');

        res.locals.message = req.flash('message');
        res.locals.success = req.flash('success');

    ```
    ***RES.LOCALS 2 notes. It must be under session AND the variable and the local variable cannot have the same name.
    So success: req.flash('success') will not work.

124.  Let's go to res locals and add message and errors
125.  Now let's add admin router to out ??????
126.  We don't have a view yet so let's test with postman.
127.  So it looks as if it didn't work but let's check our console. We see that it did work but we are seeing an error because the redirect we created doesn't exist in the view
128.  So let's create it.
129.  Go to views and create a folder called admin and a file called add-category.ejs
130.  Type through and explain what we are doing in the file. Use the other file.
131.  If that works then we now need to adjust our navbar so that the categories show up in the dropdown menus.
      Right now we have an empty dropdown menu. Check it out.
132.  To do that we first need to create a middleware that searches for all of the categories in the database and stores them in a local variable so that we can display it through our navbar view.
133.  Lets go to app.js and create the middleware:

      ```

          const Category = require('./routes/admin/models/Category');
          app.use((req, res, next) => {
          Category.find({}, (err, categories) => {
              if (err) return next(err);
              console.log(categories)
              res.locals.categories = categories;
              next();
          });
          });
      ```

134.  Test and check the console to see if we are getting our categories
135.  If so then lets go ahead and create a middleware folder in the admin categories folder and make a middleware out of this,
      THEY SHOULD DO IT.
136.  So let's go back to our add-category. I forgot a few things.
      We need to validate the input for the category and we need to move functionality to the controller.
137.  Create a utils folder in admin and a categoryValidation.js file in the folder.
      a. Lets add our validation code:


        ```
            const { check } = require('express-validator');

            const categoryValidation = [
            check('name', 'Category name cannot be empty')
                .not()
                .isEmpty()
            ];

            module.exports = categoryValidation;

        ```

138. Go to adminRoutes.js and the validation to the route

`const categoryValidation = require('./utils/categoryValidation');`
`router.post( '/add-category', categoryValidation,(req, res)=>{}....`

139. Now let's move the request handler to the controller. This time we can literally lift the function and move it and add it to the router THEY DO IT.
140. Now we need to list these categories in the dropdown of our navbar.ejs between the ul dropdown:


    ```
        <% for(let i = 0; i < categories.length; i++) {%>
            <li style=" list-style:none;"><a style="color:black;" href="/products/<%=categories[i]._id%>"><%= categories[i].name %></a></li>
          <% } %>
    ```

141. we also need to add categories locals so that they are available to the view
     a We may have already done this but if we didn't we need to add to the getAllCategories middleware
     `res.locals.categories = categories;`
142. Now lets focus on our Products. We are going to use a 3rd party api to create products for our app and it will teach us to use another product for MVP for example. In an actual business obviously we wouldn't do this.
     a. Show them faker API npm faker
     b. Teach async waterfall https://caolan.github.io/async/v3/docs.html#waterfall
     c. Async Waterfall Docs
     https://caolan.github.io/async/v3/docs.html#waterfall

import waterfall from 'async/waterfall';
Runs the tasks array of functions in series, each passing their results to the next in the function. However, if any of the tasks pass an error to their own callback, the next function is not executed, and the main callback is immediately called with the error. null is the error is null

Parameters:
Name Type Description
tasks Array
An array of async functions to run. Each function should complete with any number of result values. The result values will be passed as arguments, in order, to the next task.

callback function <optional>
An optional callback to run once all the functions have completed. This will be passed the results of the last task's callback. Invoked with (err, [results]).

Returns:
undefined

Example

```
async.waterfall([
    function(callback) {
        callback(null, 'one', 'two');
    },
    function(arg1, arg2, callback) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        callback(null, 'three');
    },
    function(arg1, callback) {
        // arg1 now equals 'three'
        callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'
});

```

// Or, with named functions:

```

async.waterfall([
    myFirstFunction,
    mySecondFunction,
    myLastFunction,
], function (err, result) {
    // result now equals 'done'
});
function myFirstFunction(callback) {
    callback(null, 'one', 'two');
}
function mySecondFunction(arg1, arg2, callback) {
    // arg1 now equals 'one' and arg2 now equals 'two'
    callback(null, 'three');
}
function myLastFunction(arg1, callback) {
    // arg1 now equals 'three'
    callback(null, 'done');
}
```

143. One more thing. We are going to add photos for products that I have already pre-chosen etc. They will not represent the products they are just for better optics. There are several different ways to handle assets such as using cloudinary which we may learn, or more popular S3 bucket. We can even load fake images from faker but when you require too many photos at once from faker sometimes the images do not load which is not visually ideal. So we have our product folders stored in public/images/products2
144. So now we are going to add products based on the chosen category. Remember where we added the id of the category to each product in our Model. Now after we choose a category, each product when we fill it will be attached to that product.
145. Let's create inside the adminRoutes.js a route for creating a product. We will create a get route and use async waterfall to get the id from the database and then create the products for the category based on getting fake info from faker API.

```
    const async = require('async');
    const faker = require('faker');
    const Product = require('./products/models/Product');

```

now we add:

```
    router.get('/add-category', categoryController.getAllCategories);

    router.post(
    '/add-category',
    categoryValidation,
    categoryController.createCategory
    );

    //Products

    router.get('create-product/:name', (req, res, next) => {
    async.waterfall([
        callback => {
        Category.findOne({ name: req.params.name }, (err, category) => {
            if (err) return next(err);

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
    return res.redirect('/add-category');
    });

```

146. LEt's test in Postman. Go to your database in Robo 3T. Check your categories. Choose one. Then go to postman
     type in the get route with a parameter that shows your category. Click send. Go back to Robo3T and check for products
147. Notice the category id is the same for all the products and matches the id of the product you chose.
148. SOOO this route is never going to have a view. Because what we ACTUALLY want to do is create the products just after we create the category and then receive a message saying all has been created.
149. Go back to add-category post route and change the redirect to point to the add-product route.
150. Then at the end of the add-product route point back to the add-category route. Now we already have the category name. So we need to add it to our route when we redirect `return res.redirect('/api/admin/add-proucts/${category.name}');`
151. Next lets move our req.flash message to the product creation since it is the last to be run and lets change it a bit. `req.flash( 'message',`Successfully added \${req.params.name.toUpperCase()} Category and 24 products`);`
     JD get rid of that back slash in there
152. Now we move the add-products to controller. THEY DO
153. Don't forget imports and re-doing the routes. Test again.

DAY 6

154. Ok now we are going to create a products page where when we choose a category in the dropdown, it shows us all the products for that category.
155. First we have to add the route.
156. Let's go to products and create a productRoutes.js. This is not part of our admin so we want to place it seperately.

Explain:
POPULATING THE REF TO THE PARENT
https://mongoosejs.com/docs/2.7.x/docs/populate.html resource
Comment and author example for you
So far we've created two models. Our Person model has its stories field set to an array of ObjectIds. The ref option is what tells Mongoose in which model to look, in our case the Story model. All \_ids we store here must be document \_ids from the Story model. We also added a \_creator ObjectId to our Story schema which refers to a single Person.

Yup that's it. We've just queried for a Story with the term Nintendo in it's title and also queried the Person collection for the story's creator. Nice!

Arrays of ObjectId refs work the same way. Just call the populate method on the query and an array of documents will be returned in place of the ObjectIds.

157. Enter code:


    ```
        const router = require('express').Router();
        const Product = require('../products/models/Product');

        router.get('/all-products/:id', (req, res, next) => {
        Product.find({ category: req.params.id })
            .populate('category')  // this is the category field in the Product model
            .exec((err, products) => {  //return an array of products with the id from category
            if (err) return next(err);
            return res.json({products}) // for testing
            //return res.render('main/category', { products }); // real did we build page? not yet. view next
            });
        });

        module.exports = router;


    ```

158. Explain how populate mongoose can only be used with an id which we get from Product.find and then exec is used when we have more than one function to run. Here we are grabbing the id from the url and finding the category which will in turn allow us to pull all of the products associated to that category.
159. Now we need to create the view to render the products of the category.
160. In views create category.ejs
     \*\*\*Here we are going to see a similar apprroach to what we could do in the homework that I assigned for the home page
161. Copy code from me.
162. This jumbotron is going to become redundant so make it into a partial and replace it in our views where it is
163. We also need to bring the productRouter into app.js or it won't work so let's do that.
     `const productRouter = ...`
     app.use('/api/products', productsRouter);
164. Test.
165. Let them know if you haven't that the css is going to get dodgier but should be organized in an ideal world. They should be able to clean up and arrange css by now.
166. Next we create a single product page to show the product we click on.
     a. Create the route in productRoutes


    ```
        router.get('/single-product/:id/', (req, res, next) => {
        Product.findById({ _id: req.params.id }, (err, product) => {
            if (err) return next(err);
            res.render('main/single-product.ejs', {
            product: product
            });
        });
        });

    ```
    b. Create the view single-product.ejs short so you could type?
    c. then in category.ejs we need to change where we click on the product or leave it it will just go to an error page.

166. PAGINATION https://itnext.io/back-end-pagination-with-nodejs-expressjs-mongodb-mongoose-ejs-3566994356e0 video 43
     More or less boilerplate code skip will skip the amount of documents based on whatever page you were on.
167.
168. Go to routes/index.js We want to choose our view based on whether we are logged in or not.
169. We are going to add a function we havent written yet. We will write it after
170. First lets choose in index.js the router.get('/') and add

     ```
         router.get('/', (req, res, next) => {
            if (req.user) {   // or req.isAuthenticated() ?
            paginate(req, res, next);
            } else {
            res.render('main/home', {
            errors: req.flash('errors')
            });
            }
        });

     ```

171. We called a paginate function. Now We are going to create a function to use in our request handler function so that we will be able to paginate the products. Follow along in index.js. Understand that the function we are writing will actually sit inside the route handler in the if(req.user) body


           ```
            function paginate(req, res, next) {
            const perPage = 6;   //products per page
            const page = req.params.pageNumber;
            Product.find()
                .skip(perPage * (page - 1))  //skip to the page number you are on, not just 1
                .limit(perPage) //limit number of products on page to 5
                .populate('category') //populate our products based on the category
                .exec((err, products) => {  //pass the products from category to the page
                if (err) return next(err);
                Product.countDocuments().exec((err, count) => {   //pass num docs to the render
                    if (err) return next(err);
                    res.render('main/home-products', {
                    products: products,
                    pages: Math.ceil(count / perPage), //num docs div by docs per page
                    page: Number(page)   //pass the page number as a number will use in ejs
                    });
                });
                });
            }

            ```

    171. Now lets create an ejs page called home-products.ejs (reference home-products.ejs). Type along.
    172. Test. Our products show up but if we click on our numbers they don't work. That's because we haven't created a route to handle going to the other pages.
    173. Lets go back and create a route so that when we click the pagination numbers it renders the next 6 products based on the page. We will again use the pagination function. (or extract it from the route if you created it in the route first.)
        a. code
        ```
            router.get('/page/:pageNumber', (req, res, next) => {
            paginate(req, res, next);
            });

        ```
        b. test.

174.  CART
175.  We are going to create a cart for each logged in user to shop with.
176.  Because the cart is always going to be associated with a user, we are going to add cart functionality in our user routes for this project.
177.  Go to routes cerate cart folderr and then models folder and create a Cart.js file. This one we will code together because there are a few things different from our other models.
178.  Here is the code:

      ```
          const mongoose = require('mongoose');
          const Schema = mongoose.Schema;

          const CartSchema = new Schema({
          owner: { type: Schema.Types.ObjectId, ref: 'User' },
          total: { type: Number, default: 0 },
          items: [
              {
              item: { type: Schema.Types.ObjectId, ref: 'Product' },
              quantity: { type: Number, default: 1 },
              price: { type: Number, default: 0 }
              }
          ]
          });

          module.exports = mongoose.model('Cart', CartSchema);
      ```

179.  So first we need to delete all of our users because none of our users have a cart.
180.  Go to Robo 3T. Right click your db and choose drop database
181.  Now lets create a cart file and cartController.js and a cart route.
182.  We are going to directly use the cartController instead of the route because the function we are creating will actually be called inside the userRoute.
183.  Lets make a function called createUserCart

          ```

               createUserCart: (req, res) => {
                    let cart = new Cart()

                    cart.owner = req.user._id

                    cart.save((error) => {
                        if (error) {
                            res.status(500).json({
                                confirmation: 'failure',
                                message: error
                            })
                        } else {
                            res.redirect('/')
                        }
                    })

                },

          ```

184.  Next lets go to the userRoute and add the createUserCart to the register route.
      a. test and allow error to happen
185.  Also go to userController where we will remove
      `res.redirect('/');` so that we can move to the next function and create our cart.
186.  Now that we have that working we need to create a cart icon and total in our navbar and we need a middleware that will check to see how many items the user has in the cart and post it.
187.  Let's actually start with the middleware.
188.  In the cart folder create another folder called middleware.


    ```

        module.exports = (req, res, next) => {
        if (req.user) {
            Cart.findOne({ owner: req.user._id })
            .then(cart => {
                if (cart) {
                let totalItems = 0;

                for (let item of cart.items) totalItems += item.quantity;

                res.locals.cartTotal = totalItems;

                next();
                } else {
                res.locals.cartTotal = 0;

                next();
                }
            })
            .catch(err => {
                let errors = {};
                errors.status = 500;
                errors.message = err;

                res.status(errors.status).json(errors);
            });
        } else {
            next();
        }
        };

    ```
    b. CODE EXPLAIN:
    The reason we are looping through the items is because if you notice in the model we have an array of items each one with a total. In order to get the full total of the items we have to loop through and add to the total the quanity we have chosen for each itme. Then we want to have that total available in the locals cartTotal variable.

189.  Now we need to add this middleware to the app.js so that when the user logs in the cart total shows in the navbar. (We haven't added that car to the navbar yet)
      a. NOTE: make sure you put the app.use ABOVE the routes or your locals won't transfer to the routes
190.  Bring in the cartMiddleware to variable cartTotal and then app.use(cartTotal)
191.  Now we need to add the cart to the navbar.
      a. Code: (This code goes between Hello <name> and Logout anchors)

      ```
          <span style="margin: 0 10px;">
          <a href="/api/cart">
          <span style="color:#5cb85c;" class="fa-stack has-badge" data-count=<%= cartTotal %> >
          <i style="font-size:1.1em;" class="fa fa-shopping-cart"></i><span style="padding-left:5px;"><%= cartTotal %></span>
          </span>
          </a>
          </span>

      ```

192.  Next we need a route to add a product to the cart. Go to the cartRoute and create the post
193.  CODE: (Video 52)


    ```

        router.post('/:product_id', (req, res, next) => {
        Cart.findOne({ owner: req.user._id }, (err, cart) => {
            if (err) return next(err);

            cart.items.push({
            item: req.body.product_id,
            price: parseFloat(req.body.priceValue),
            quantity: parseInt(req.body.quantity)
            });
            cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);
            cart
            .save()
            .then(cart => {
                return res.redirect('/api/cart');
            })
            .catch(err => next(err));
        });
        });


    ```

194. Next we need to add the route to app.js as usual.
195. Go back over the single-product ejs for them
196. Now we want the plus and minus buttons to increment and for the price to increase and decrease when we press the buttons and add or subtract from the quanity.
     We will do that using vanllia javascript.
197. In your public folder, add a folder called js and a file called productQuantityAdjust.js
     User the code to add plus and minus and compare it to the single-product.ejs page inputs that are hidden
     Hidden values are values we will send to the server while non-hidden are to show to the user
198. Next we need to add this script into our scripts partial so that it is loaded with the app.
199. Reboot and test
200. Next we need to add a cart GET route and a cart page for the Cart. Let's start with the route
201. Go to your cartRoutes.js and create a page with a route endpoint to show the cart
202. Test to make sure the route works. Make sure the param route is last
203. CART Code for route

```

router.get('/cart', (req, res, next) => {
  Cart.findOne({ owner: req.user._id })
    .populate('items.item')
    .exec((err, foundCart) => {
      if (err) return next(err);
      res.render('main/cart', {
        foundCart: foundCart,
        message: req.flash('remove')
      });
    });
});
```

204. Next create the cart.ejs page in views/main. Lookup code in file.
205. Test
206. Now what if we want to remove an item from the cart? We will need a route to do that and to hook up the functionality of our button in the cart.ejs file
207. Go to your cartRoutes.js file and add a post route for remove-item \*\*ABOVE PARAM post


    ```
           router.post('/product/remove', (req, res, next) => {
            Cart.findOne({ owner: req.user._id }).then(cart => {
                console.log(cart);
                cart.items.pull(String(req.body.item));
                cart.total = (cart.total - parseFloat(req.body.price)).toFixed(2);
                cart
                .save()
                .then(cart => {
                    req.flash('remove', 'Successfully removed');
                    return res.redirect('/api/cart');
                })
                .catch(err => next(err));
            });
            });

    ```

207. Test

STRIPE:

- sign up
- got to your email address and confirm address
- no credit card needed
- test account on web by making payment
- npm i stripe
- now put secret key in .env
  `STRIPE_SK = 'sk_test_BxviEgDqIsMfCtWGJQSukkuK00yUu6YBqA'`
- go to cartRoutes and bring it in:
  `const stripe = require('stripe')(process.env.STRIPE_SK);`
  JD if dotenv doesn't work move key to cartRoutes.js
- go to cartRoutes and create a /payment post route
- we will get the amount from the db. Stripe reads amounts as integers
  so 74.99 must be converted to 7499 and stripe will then interpret that as
  74.99. So we must multiply the amount by 100
- we create our customer with an email that we send and an id
  The id is what is going to allow us to charge the customer
- then we send it the amount, the id and other possible info

```
router.post('/payment', (req, res, next) => {
  Cart.findOne({ owner: req.user._id }).then(cart => {
    let amount = Math.ceil((cart.total + 5.99) * 100);
    stripe.customers
      .create({
        email: req.body.email,
        card: req.body.id
      })
      .then(customer => {
        let result = stripe.charges.create({
          amount,
          description: 'Online Shopping Charge',
          currency: 'usd',
          customer: customer.id
        });
        return result;
      }).
      then(result=>{

          console.log('result...', result)
      })
 });
});
```

-- This route is going to directly go to the stripe api online. stripe.customers
and stripe.charges and we are sending them the information

- next we have to create a js file that will grab the button on the ejs cart page and send the info using the public key to the payment /api/cart/payment route to send to stripe

- the open will checkoutHandler.open will open up a popup box for us configured by stripe

next we grab the button that will be on our ejs page,
when clicked we open and give it a token which we will define with the handleToken and we will see later

```
const checkoutHandler = StripeCheckout.configure({
  key: 'pk_test_2g6zghPILvhPwwS6zxSEnymu00WX2jwASZ',
  locale: 'auto'
});

function handleToken(token) {
  fetch('/api/cart/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(token)
  });
}

const button = document.getElementById('buttonCheckout');

button.addEventListener('click', function(ev) {
  checkoutHandler.open({
    name: 'Online Shopper',
    description: 'Items Purchased',
    token: handleToken  //this will be called if everything goes ok
  });
});




```

Let's check the button in the cart.ejs file. It should have an id of buttonCheckout

- now we need to add two scripts to our partials scripts file

  <script src="https://checkout.stripe.com/checkout.js"></script>
  <script src="/js/stripe.js" defer></script>

- they bring the stripe api into our client
- now we need to

TEST?
check the web dashboard
look at payments
show also the info that you sent in the header
also look at the results in the console of your terminal

Next we want to make sure when we purchase stuff we clear the items we purchased
Go to cartRoute

```
 .then(result => {
        cart.items = [];
        cart.total = 0;
        cart.save();
      })

```

This will cause the database to empty.
If you refresh the page you should see things reset
TEST
I will let you figure out how to change the page itself

CREATE
HISTORY

WIPE your user collection NOW
ONLY WIPE Users and CARTS.
Nothing else.

go to your User model and add

```
 history: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      paid: { type: Number, default: 0 },
      timestamp: {
        type: String,
        default: () => moment().format('MMMM Do YYYY, h:mm:ss a')
      }
    }
  ],
  timestamp: {
    type: String,
    default: () => moment().format('MMMM Do YYYY, h:mm:ss a')
  }


```

- install Moment so we can have a date for each purchase
- we are now going to create a history of purchases for a user
  TEST and look in db robo3t. nothing in history but we have timestamp and history array

next let's go to cart and push items into the array of what the user buys

we will go to cartroutes and add to our history BEFORE we clean out the cart
JD checkout cartRoutes.js this goes before

```

 .then(() => {
        let user = req.user;

        for (let order of cart.items) {
          user.history.push({
            item: order.item,
            paid: order.price
          });
        }
        user.save();
      })

```

TEST BUY SOME ITEMS and check db
Check the db and we should see it in the user collection

Now we want to create a history on the profile page of the user purchases
We will do this on profile.ejs
We will add this code underneath the colorgraph

```
  <br />
          <h3>Purchase History:</h3>
          <table class="table table-striped sticky-header">
            <thead>
              <tr>
                <th>Date</th>
                <th>Items</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              <% for( let i = 0; i < user.history.length; i++ ) { %>
              <tr>
                <td><%=user.history[i].timestamp %></td>
                <td><%= user.history[i].item.name %></td>
                <td>$<%= user.history[i].paid %></td>
              </tr>
              <% } %>
            </tbody>
          </table>
          <hr class="colorgraph" />

```

Check out page. We are almost there but we are missing the items.
So....
This won't work yet.
We also need to make an adjustment to our userRoutes.js get /profile
So that we populate the page with the items the user has purchased

```
if (req.isAuthenticated()) {
    User.findOne({ _id: req.user._id })
      .populate('history.item')
      .exec(function(err, foundUser) {

        if (err) return next(err);
        res.render('auth/profile', { user: foundUser });
      });
  }


``
```

Think you forgot to add admin/add-category.ejs
plus hookup productController to req.flash and redirect to the page in addProducts function

get rid of req.flash in createCategory of categoryController

also need to add create category to the nav bar with a link to api/admin/add-category
and adminRoutes should have /add-category get route

remember deploy heroku
