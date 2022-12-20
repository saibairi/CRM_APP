const notificationCron = require('./notificationCron');

module.exports = {
    start: () => {
        notificationCron.start();
    }
}