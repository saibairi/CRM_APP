const {default : mongoose} = require("mongoose");

const statuses = ['open', 'close', 'pending'];

const ticketSchema = mongoose.Schema({
    ticket : {
        type : String,
        requried : true
    },
    description : {
        type : String,
        requried : true
    },
    priority : {
        type : Number,
        requried : true,
        default : 0
    },
    status : {
        type : String,
        enum : statuses,
        default : 'open'
    },
    rasiedByUser : {
        type : String
    },
    assignedToUser : {
        type : String
    },
},{
    timestamp : true,
    statics : {
        statuses : statuses
    }
});

ticketSchema.virtual('isClosed').get(function(){
    return this.status === 'closed'
});

module.exports = mongoose.model("Ticket", ticketSchema);