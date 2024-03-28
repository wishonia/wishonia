const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
require('./src/auth/google_oauth')(passport);
const pollsApi = require('./src/api/polls');

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
    const { email, gdprConsent } = req.body;
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

        // Create user
        const newUser = await prisma.user.create({
            data: {
                email: email,
                gdprConsent: gdprConsent, // Record GDPR consent
                ipAddress: ipAddress, // Store the user's IP address
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

// API routes
app.use('/api/polls', pollsApi);

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
    console.log(`Server running on ${BASE_URL}`);
});
module.exports = app; // Export the Express app instance
function generateLoginToken() {
  return require('crypto').randomBytes(20).toString('hex');
}

function sendMagicLinkEmail(email, loginToken) {
  const magicLink = `${BASE_URL}/auth/verify-token?token=${loginToken}`;
  const message = {
    from: 'Your Name <mailgun@YOUR_DOMAIN.com>',
    to: email,
    subject: 'Login Magic Link',
    text: `Click here to log in: ${magicLink}`
  };

  mg.messages.create(process.env.MAILGUN_DOMAIN, message)
    .then(msg => console.log(msg)) // Logs success message
    .catch(err => console.error(err)); // Logs any errors
}


