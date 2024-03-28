const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// Register a new user
router.post('/register', async (req, res) => {
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
router.post('/login', async (req, res) => {
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

module.exports = router;
