const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
require('./src/auth/google_oauth')(passport);
const pollsApi = require('./src/api/polls');
const usersApi = require('./src/api/users');

require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login.html' }),
    (req, res) => {
        // Successful authentication, redirect to results.
        res.redirect('/results.html');
    });

// API routes
app.use('/api/polls', pollsApi);
app.use('/api/users', usersApi);

// Handling submissions from the petition form
app.post('/submit-petition', (req, res) => {
    const { name, email, address, city, state, zip } = req.body;
    // Here you would typically validate the data and then save it to your database
    console.log('Petition submitted with the following data:', req.body);
    // Assuming the existence of a method to update the user with petition information
    // Update the user model with petition-related fields and set signedPetition to true
    // Redirect or send a response indicating success
    res.redirect('/thank_you.html');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
