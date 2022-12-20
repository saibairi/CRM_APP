const{default: mongoose} = require("mongoose");

const statuses = ['pending','sent'];

const notificationSchema = mongoose.Schema({
    subject : {
        type : String,
        requried : true
    },
    body : {
        type : String,
        requried : true
    },
    emails : {
        type : [String],
        requried : true
    },
    status : {
        type : String,
        enum : statuses,
        default : 'pending'
    },
    userId : {
        type : String,
        requried : true
    },
    ticketId : {
        type : String,
        requried : true
    }
    
},{
    timestamps : true,
    statics : {
        statuses : statuses
    }
});

module.exports = mongoose.model("Notification", notificationSchema);