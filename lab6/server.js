// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));


// --- Middleware ---
// Body parser for handling form data
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// Passport middleware initialization
app.use(passport.initialize());
app.use(passport.session());

// Import User model and Passport configuration
const User = require('./User');
require('./passport-config')(passport);

// --- Routes ---
// Serve static files (HTML, CSS, etc.)
app.use(express.static('public'));

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`<h1>Hello, ${req.user.username}!</h1><a href="/logout">Logout</a>`);
    } else {
        res.sendFile(__dirname + '/login.html');
    }
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Registration route
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).send("User already exists. Please login.");
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = new User({
            username: username,
            password: hashedPassword
        });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).send("An error occurred during registration.");
    }
});

// Login route
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false // Set to true if you want to use connect-flash for flash messages
}));

// Logout route
app.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

// Protected route example
app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Welcome to your profile, ${req.user.username}!`);
    } else {
        res.redirect('/login');
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
