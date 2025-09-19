// Import required modules
const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');
const fs = require('fs'); // File System module to read HTML files

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: 'Rudrax@3017', // Your MySQL password
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

// Middleware to parse POST request bodies and serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));


// --- ROUTES ---

// Route for the main login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Route to serve the signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Route to handle login authentication
app.post('/auth', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], (error, results) => {
            if (error) throw error;
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

// Route to handle new user registration
app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    if (username && password && email) {
        connection.query('SELECT * FROM accounts WHERE username = ?', [username], (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
                res.send('Username already exists!');
            } else {
                connection.query('INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)', [username, password, email], (err, result) => {
                    if (err) throw err;
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect('/home');
                });
            }
            res.end();
        });
    } else {
        res.send('Please fill out all fields!');
        res.end();
    }
});


// Route for the protected home page
app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        // Read the home.html file
        fs.readFile(path.join(__dirname, 'home.html'), 'utf8', (err, data) => {
            if (err) {
                res.status(500).send("Error loading the page.");
                return;
            }
            // Replace placeholder with the actual username and send the file
            const personalizedHtml = data.replace('{{username}}', req.session.username);
            res.send(personalizedHtml);
        });
    } else {
        res.redirect('/');
    }
});

// Route for logging out
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

