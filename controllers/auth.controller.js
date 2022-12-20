const { decode } = require("jsonwebtoken");
const {handleUnauthorizedResponse,handleNotFoundResponse,handleServerErrorResponse,generateAccesToken,generateRefreshToken,verifyAccesToken,decodeAccessToken} = require("../helpers");
const {User} = require("../models");

const register = async(req, res)=>{
    let user = await User.create({
        name : req.body.name,
        username : req.body.username,
        password : req.body.password,
        email : req.body.email,
        role : req.body.role || undefined,
        isEnable : req.body.isEnable || undefined
    }).catch(error=> handleServerErrorResponse(res, error));
    if(user){
        res.status(201).json(user);
    }
}

const login = async(req,res)=>{
    const user = await User.authenticate(req.body.username&& req.body.password).catch(error=>handleUnauthorizedResponse(res));
    if(user){
        user.refreshToken = generateRefreshToken();
        user.save();
        res.status(200).json({
            accessToken : generateAccesToken(res),
            refreshToken : user.refreshToken
        });
    }
}

const logout = async(req, res)=>{
    res.status(200).json({
        message : "Logout successfully"
    });
}

const refresh = async(req,res)=>{
    const payload = await decodeAccessToken(req.body.accessToken);
    const user = await User.findOne({
        id : payload.id,
        refreshToken : req.body.refreshToken
    }).catch(error=>handleServerErrorResponse(res, error));
    if(user){
        user.refreshToken = generateRefreshToken();
        user.save();
        res.status(200).json({
            accessToken : generateAccesToken(res),
            refreshToken : user.refreshToken
        });
    } else {
        handleNotFoundResponse(res);
    }
}


module.exports = {
    register : register,
    login : login,
    logout : logout,
    refresh : refresh
}