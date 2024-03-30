
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

async function sendMagicLinkEmail(email, loginToken, baseUrl, mailgunDomain, mailgunApiKey) {
    const mg = mailgun.client({username: 'api', key: mailgunApiKey
        //, url: 'https://api.eu.mailgun.net'
    });
    const magicLink = `${baseUrl}/auth/verify-token?token=${loginToken}`;
    const message = {
        from: 'Wishonia <hello@wishonia.love>',
        to: email,
        subject: 'Your Magic Login Link',
        text: `Click here to log in: ${magicLink}`
    };
    return await mg.messages.create(mailgunDomain, message)
        //.then(msg => console.log(msg)) // Logs success message
        .catch(err => console.error(err)); // Logs any errors
}

module.exports = { sendMagicLinkEmail };
