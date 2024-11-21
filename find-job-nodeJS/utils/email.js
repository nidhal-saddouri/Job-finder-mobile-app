const nodemailer = require('nodemailer');

const sendEmail = async function(opt){
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'nidhalsaddouri33@gmail.com',
            pass: 'xwam jwdu gsph nyqh'
        }
    })
console.log(opt)
    const mailoption = {
        from: 'nidhalsaddouri33@gmail.com',
        to:opt.email,
        subject: opt.subject,
        text: opt.message,
    }

    await transporter.sendMail(mailoption)
}

module.exports = sendEmail