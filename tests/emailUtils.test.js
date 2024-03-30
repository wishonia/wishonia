
require('dotenv').config();
const { sendMagicLinkEmail } = require('../src/utilities/emailUtils');

describe('sendMagicLinkEmail with real Mailgun service', () => {
    it('should successfully send an email using Mailgun', async () => {
        const email = 'm@thinkbynumbers.org'; // Use a controlled test email address
        const loginToken = '123456';
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const mailgunDomain = process.env.MAILGUN_DOMAIN;
        const mailgunApiKey = process.env.MAILGUN_API_KEY;

        // Call the actual sendMagicLinkEmail function
        const response = await sendMagicLinkEmail(email, loginToken, baseUrl, mailgunDomain, mailgunApiKey);

        // Verify the response indicates a successful send
        // Note: Adjust the expectation based on the actual success response from Mailgun
        expect(response).toHaveProperty('id');
        expect(response).toHaveProperty('message', 'Queued. Thank you.');
    });
});
