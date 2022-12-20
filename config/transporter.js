const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();

module.exports = (async function() {

    const config = {
        host: process.env.MAILER_HOST || '',
        port: process.env.MAILER_PORT || 999,
        secure: process.env.MAILER_SECURE || false,
        auth: {
            user: process.env.MAILER_USER || '',
            pass: process.env.MAILER_PASS || '',
        }
    }
    
    if(process.env.MAILER_TEST || true) {
        const testAccount = await nodemailer.createTestAccount();
        config.host = 'smtp.ethereal.email';
        config.port = 587;
        config.secure = false;
        config.auth.user = testAccount.user;
        config.auth.pass = testAccount.pass;
    }

    const transporter = nodemailer.createTransport(config);

    return { transporter };

})();