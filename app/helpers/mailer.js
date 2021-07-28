/*require("dotenv").config();
const nodemailer = require("nodemailer");
async function sendEmail(email, code) {
    try {
        const smtpEndpoint = "smtp.sendgrid.net";
        const port = 465;
        const senderAddress = "malek.souissi@esen.tn";
        var toAddress = email;
        const smtpUsername = "malek";
        const smtpPassword = "20837908";
        var subject = "Verify your email";
        // The body of the email for recipients
        var body_html = `<!DOCTYPE> 
    <html>
      <body>
        <p>Your authentication code is : </p> <b>${code}</b>
      </body>
    </html>`;
        // Create the SMTP transport.
        let transporter = nodemailer.createTransport({
            host: smtpEndpoint,
            port: port,
            secure: true, // true for 465, false for other ports
            auth: {
                user: smtpUsername,
                pass: smtpPassword,
            },
        });
        // Specify the fields in the email.
        let mailOptions = {
            from: senderAddress,
            to: toAddress,
            subject: subject,
            html: body_html,
        };
        let info = await transporter.sendMail(mailOptions);
        return { error: false };
    } catch (error) {
        console.error("send-email-error", error);
        return {
            error: true,
            message: "Cannot send email",
        };
    }
}
module.exports = { sendEmail };*/


const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: 587,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;