const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        // Check if user already exists in our database
        try {
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: profile.emails[0].value,
                },
            });
            if (existingUser) {
                // User exists, proceed to log them in
                return done(null, existingUser);
            } else {
                // User doesn't exist, create a new user
                const newUser = await prisma.user.create({
                    data: {
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        googleId: profile.id // Storing Google ID for future logins
                    }
                });
                return done(null, newUser);
            }
        } catch (error) {
            console.error('Error processing Google OAuth login:', error);
            return done(error, null);
        }
    }));

    // Serialize user into the sessions
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user from the sessions
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            done(null, user);
        } catch (error) {
            console.error('Error deserializing user:', error);
            done(error, null);
        }
    });
};
