const {isObjectId, handleBadRequestResponse,handleNotFoundResponse,handleServerErrorResponse} = require("../helpers");
const {Notification, Ticket} = require("../models");

const indexByTicket = async(req, res)=>{
    if(!isObjectId(req.params.id)){
        return handleNotFoundResponse(res,"Invalied Id");
    }
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        handleNotFoundResponse(res, " Ticket not found");
    }
    Notification.find({
        ticketId : ticket.id
    }).then(items=>{
        res.status(200).json(items);
        res.end();
    }).catch(error=>{
        handleServerErrorResponse(res, error);
    });
}

const create = async(req, res)=>{
    Notification.create({
        subject : req.body.subject,
        body : req.body.body,
        email : req.body.email,
        ticketId : req.body.ticketId,
        userId : req.user.userId
    }).then(data=>{
        res.status(201).json(data);
        res.end();
    }).catch(error=>{
        handleServerErrorResponse(res, error);
    });
}


module.exports = {
    indexByTicket : indexByTicket,
    create : create
}