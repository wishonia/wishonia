// config/config.js

// This configuration file will hold all the environment-specific settings
// for our application. It's important to keep sensitive information like
// database credentials, API keys, and secret keys out of the source code.
// We use environment variables to achieve this.

require('dotenv').config(); // This will load all the environment variables from a .env file

module.exports = {
    // Port number where the server will listen
    port: process.env.PORT || 3000,

    // Database connection settings
    db: {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },

    // Session settings for express-session
    session: {
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: true,
    },

    // Google OAuth settings
    googleOAuth: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    // Email service settings for notifications
    emailService: {
        service: process.env.EMAIL_SERVICE,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

    // Localization settings
    localization: {
        defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
    },

    // Gamification settings
    gamification: {
        pointsPerPoll: parseInt(process.env.POINTS_PER_POLL, 10) || 10,
        pointsPerReferral: parseInt(process.env.POINTS_PER_REFERRAL, 10) || 5,
    },

    // Mailgun Configuration
    mailgun: {
        username: process.env.MAILGUN_USERNAME,
        key: process.env.MAILGUN_API_KEY,
        url: process.env.MAILGUN_URL,
    },

    // Base URL Configuration
    baseURL: process.env.BASE_URL,
};