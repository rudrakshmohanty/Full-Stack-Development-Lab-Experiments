const express               = require('express'),
      app                   = express(),
      mongoose              = require('mongoose'),
      passport              = require('passport'),
      bodyParser            = require('body-parser'),
      LocalStrategy         = require('passport-local'),
      User                  = require('./model/User');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/auth_demo_app")
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.use(require("express-session")({
    secret: "This is a secret key for the session",
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass current user to all templates
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// ==============
//      ROUTES
// ==============

app.get("/", (req, res) => res.render("home"));
app.get("/secret", isLoggedIn, (req, res) => res.render("secret"));
app.get("/register", (req, res) => res.render("register"));

app.post("/register", (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/secret");
        });
    });
});

app.get("/login", (req, res) => res.render("login"));

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), (req, res) => {});

app.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));