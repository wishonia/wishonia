const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to check if the path matches a user's handle
router.get('/:handle', async (req, res, next) => {
    const { handle } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                handle: handle,
            },
        });
        if (user) {
            // If the handle matches a user, save the handle in localStorage and redirect to the signup page
            const script = `<script>
                                localStorage.setItem('referrerHandle', '${handle}');
                                window.location.href = '/signup.html';
                            </script>`;
            return res.send(script);
        }
        next(); // If no user is found with the handle, move to the next middleware
    } catch (error) {
        console.error('Error checking user handle:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
