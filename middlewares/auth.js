const {verifyAccesToken} = require("../helpers");
const {User} = require("../models");

module.exports = {
    authenticate : async(req, res, next)=>{
        const authorization = req.header('Authorization') || '';
        const token = authorization.split(' ')[1];
        if(!token){
            res.status(401).send({message : "Ticket not found"});
            return;
        }
        const payload = await verifyAccesToken(token);
        if(payload){
            req.user = payload;
            next();
        }
        res.status(403).send({message : "Token invailed or expired"});
        return;
    },

    authorize : async(req, res, next)=>{
        return module.exports.authorizeRoles(['admin'])(req, res, next);
    },

    authorizeRoles : roles=>{
        return async(req, res, next)=>{
            if(req.user){
                const user = await User.findById(req.user.id);
                const authorized = Array.isArray(roles) ? roles.includes(user.role) : roles === user.role;
                if(authorized) return next();
            }
            res.status(403).send({message : "premission not granted"});
            return; 
        }
    }
}