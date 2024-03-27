const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'User not authenticated' });
}

// Route to submit poll responses
router.post('/submit', isAuthenticated, async (req, res) => {
    const userId = req.user.id; // Assuming req.user is populated by the authentication middleware
    const { WarPercentageDesired, warPercentageGuessed } = req.body;

    if (WarPercentageDesired == null || warPercentageGuessed == null) {
        return res.status(400).json({ message: 'Missing required poll response fields' });
    }

    try {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                WarPercentageDesired: WarPercentageDesired,
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
router.get('/average', async (req, res) => {
    try {
        const averageResponses = await prisma.user.aggregate({
            _avg: {
                WarPercentageDesired: true,
                warPercentageGuessed: true
            }
        });
        res.status(200).json(averageResponses);
    } catch (error) {
        console.error('Error fetching average poll responses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
