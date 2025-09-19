// Import required modules
const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Rudrax@3017',
    database: 'lab8'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the MySQL server.');
});

// Initialize the Express app
const app = express();

// Set up the session middleware
app.use(session({
    secret: 'your-secret-key', // Change this to a random secret key
    resave: true,
    saveUninitialized: true
}));

// Middleware to parse POST request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "static" directory
app.use(express.static(path.join(__dirname, 'static')));

// Define the route for the main login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Define the authentication route
app.post('/auth', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        // Query the database to find the user
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], (error, results, fields) => {
            if (error) throw error;
            // If a user is found
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/home');
            } else {
                res.send('Incorrect Username and/or Password!');
            }
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});

// Define the protected home page route
app.get('/home', (req, res) => {
    // Check if the user is logged in
    if (req.session.loggedin) {
        res.send(`Welcome back, ${req.session.username}! <br><a href="/logout">Logout</a>`);
    } else {
        res.redirect('/');
    }
    res.end();
});

// Define the logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
