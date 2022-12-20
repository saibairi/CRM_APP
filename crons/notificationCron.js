const cron = require('node-cron');
const { transporter } = require('../config/transporter');

// console.log(transporter);

module.exports = {
    start: () => {
        console.log("Notification Cron inititalized");
        cron.schedule('*/30 * * * * *', () => {
            console.log(transporter);
        });
    }
}