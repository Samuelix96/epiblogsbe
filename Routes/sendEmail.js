const express = require("express");
const { createTransport } = require("nodemailer")
const email = express.Router()

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'adrien.barton40@ethereal.email',
        pass: 'yBTjBRDBJdSF56YUy4'
    }
});

email.post('/send-email', async (req, res) =>
{
    const { subject, text } = req.body;

    const mailOptions = {
        from: "norepaly@samuelebagorha.com",
        to: "adrien.barton40@ethereal.email",
        subject,
        text
    }

    transporter.sendMail(mailOptions, (error, info) =>
    {
        if (error)
        {
            console.error(error)
            res.status(500).send("errore durante durante l email")
        } else
        {
            console.log("mail inviata")
            res.status(200).send("Email inviata con successo")
        }
    })
})

module.exports = email;