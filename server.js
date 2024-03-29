const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
require('./src/auth/google_oauth')(passport);

require('dotenv').config();

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY, url: 'https://api.eu.mailgun.net'});

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register a new user
app.post('/auth/register', async (req, res) => {
    const { email, gdprConsent, handle } = req.body;
    const ipAddress = req.ip; // Capture the user's IP address
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Check if handle already exists
        const existingHandle = await prisma.user.findUnique({
            where: {
                handle: handle,
            },
        });
        if (existingHandle) {
            return res.status(409).json({ message: 'Handle already exists' });
        }

        // Create user
        const newUser = await prisma.user.create({
            data: {
                email: email,
                gdprConsent: gdprConsent, // Record GDPR consent
                ipAddress: ipAddress, // Store the user's IP address
                handle: handle, // Store the user's handle
            },
        });
        res.status(201).json({ user: newUser, message: 'User created successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login a user
app.post('/auth/login', async (req, res) => {
    const { email } = req.body;
    try {
        // Generate a unique login token and its expiration time
        const loginToken = require('crypto').randomBytes(20).toString('hex');
        const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

        // Store the login token and its expiration in the user's record
        await prisma.user.update({
            where: { email },
            data: { loginToken, tokenExpires },
        });

        function sendMagicLinkEmail(email, loginToken) {
            const magicLink = `${BASE_URL}/auth/verify-token?token=${loginToken}`;
            const message = {
                from: 'Wishonia <hello@wishonia.love>',
                to: email,
                subject: 'Your Magic Login Link',
                text: `Click here to log in: ${magicLink}`
            };

            mg.messages.create(process.env.MAILGUN_DOMAIN, message)
                .then(msg => console.log(msg)) // Logs success message
                .catch(err => console.error(err)); // Logs any errors
        }

        // Send an email with a magic link containing the token
        sendMagicLinkEmail(email, loginToken);

        res.send({ message: 'Magic link sent to your email.' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in user' });
    }
});

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login.html' }),
    (req, res) => {
        // Successful authentication, redirect to results.
        res.redirect('/results.html');
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


// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'User not authenticated' });
}

// API routes
// Route to submit poll responses
app.post('/api/poll/submit', isAuthenticated, async (req, res) => {
    const userId = req.user.id; // Assuming req.user is populated by the authentication middleware
    const { warPercentageDesired, warPercentageGuessed } = req.body;

    if (warPercentageDesired == null || warPercentageGuessed == null) {
        return res.status(400).json({ message: 'Missing required poll response fields' });
    }

    try {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                warPercentageDesired: warPercentageDesired,
                warPercentageGuessed: warPercentageGuessed
            }
        });
        res.status(200).json({ message: 'Poll response saved successfully' });
    } catch (error) {
        console.error('Error saving poll response:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to get average poll responses
app.get('/api/poll/average', isAuthenticated, async (req, res) => {
    try {
        const averageResponses = await prisma.user.aggregate({
            _avg: {
                warPercentageDesired: true,
                warPercentageGuessed: true
            }
        });
        res.status(200).json(averageResponses);
    } catch (error) {
        console.error('Error fetching average poll responses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Handling submissions from the petition form
app.post('/api/submit-petition', isAuthenticated, (req, res) => {
    const { name, email, address, city, state, zip } = req.body;
    // Here you would typically validate the data and then save it to your database
    console.log('Petition submitted with the following data:', req.body);
    // Assuming the existence of a method to update the user with petition information
    // Update the user model with petition-related fields and set signedPetition to true
    // Redirect or send a response indicating success
    res.redirect('/thank_you.html');
});

// We do this in start.js so we can run tests without starting the server
// app.listen(PORT, () => {
//     console.log(`Server running on ${BASE_URL}`);
// });
module.exports = app; // Export the Express app instance
