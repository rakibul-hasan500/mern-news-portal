const nodemailer = require('nodemailer')


const sendMail = async (receiver, subject, text, html)=>{
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: receiver,
            subject,
            text,
            html
        })
    }catch(error){
        throw error
    }
}


module.exports = sendMail