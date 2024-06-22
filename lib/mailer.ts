import nodemailer from "nodemailer";
export async function sendEmail(to: string, subject: string, text: string, html: string) {
    if(!process.env.EMAIL_SERVER) {
        throw new Error("EMAIL_SERVER is not set in the environment variables");
    }
    const emailServerUrl = new URL(process.env.EMAIL_SERVER);
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: emailServerUrl.hostname,
        port: parseInt(emailServerUrl.port),
        secure: emailServerUrl.protocol === 'smtps:',
        auth: {
            user: emailServerUrl.username,
            pass: emailServerUrl.password,
        },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Wishonia" <hello@wishonia.love>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    return info;
}