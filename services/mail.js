const nodemailer = require("nodemailer");
const sentMail = async (fromMail, toMail) => {
    var mailOptions = {
        from: fromMail,
        to: toMail,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'functionupravi@gmail.com',
            pass: "rwpmdrmvalumqlpq"
        }
    });

    let mailResponse;
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            mailResponse = error
            console.log({ error: error });
        } else {
           
            mailResponse = info
            console.log('Email sent: ' + info);
        }
    });

    return mailResponse;
}

module.exports = {
    sentMail,
    
}

