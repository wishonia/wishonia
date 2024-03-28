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

// User registration and login routes
app.post('/api/users/register', async (req, res) => {
    // Here you would typically validate the data, hash the password, and then save the user to your database
    const { email, password } = req.body;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save the user to the database
    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        console.log('User registered:', user);
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send({ message: 'Error registering user' });
    }
});

app.post('/api/users/login', async (req, res) => {
    // Here you would typically validate the login credentials
    const { email } = req.body;
    try {
        // Generate a unique login token and its expiration time
        const loginToken = generateLoginToken(); // Placeholder for token generation logic
        const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

        // Store the login token and its expiration in the user's record
        await prisma.user.update({
            where: { email },
            data: { loginToken, tokenExpires },
        });

        // Send an email with a magic link containing the token
        sendMagicLinkEmail(email, loginToken); // Placeholder for email sending logic

        res.send({ message: 'Magic link sent to your email.' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ message: 'Error logging in user' });
    }
});

// Endpoint to verify the login token from the magic link and authenticate the user
app.get('/auth/verify-token', async (req, res) => {
    const { token } = req.query;
    try {
        const user = await prisma.user.findUnique({
            where: {
                loginToken: token,
                // Ensure the token hasn't expired
                tokenExpires: {
                    gt: new Date(),
                },
            },
        });
        if (user) {
            // Authenticate the user
            // This would typically involve creating a session or similar
            console.log('User authenticated successfully:', user);
            res.send({ message: 'User authenticated successfully' });
        } else {
            res.status(401).send({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).send({ message: 'Error verifying token' });
    }
});

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
module.exports = app; // Export the Express app instance
