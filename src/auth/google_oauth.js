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
            const existingAccount = await prisma.account.findUnique({
                where: {
                    providerAccountId: profile.id,
                },
                include: {
                    user: true, // Include the user linked to this account
                }
            });
            if (existingAccount) {
                // Account exists, proceed to log the user in
                return done(null, existingAccount.user);
            } else {
                // Account doesn't exist, create a new user and account
                const newUser = await prisma.user.create({
                    data: {
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        image: profile.photos[0].value,
                        // Additional fields can be added here
                    }
                });
                const newAccount = await prisma.account.create({
                    data: {
                        googleId: profile.id,
                        userId: newUser.id, // Linking the new account to the new user
                        provider: 'google',
                        providerAccountId: profile.id,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        // Additional fields can be added here
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
