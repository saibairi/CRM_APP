const { check, validationResult } = require('express-validator');
const { isObjectId } = require('../helpers');
const { User, Ticket } = require("../models");

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
}

module.exports = {
    authRegister: [
        check('name').trim().escape().not().isEmpty().withMessage('Name cannot be empty').bail().isLength({ min: 3 }).withMessage('Name must be minimum 3 characters').bail(),
        check('username').trim().escape().not().isEmpty().withMessage('Username cannot be empty').bail().custom(value => {
            return User.findOne({ username: value }).then(user => { if(user) return Promise.reject('Username is already taken')} );
        }),
        check('email').trim().escape().not().isEmpty().withMessage('Email cannot be empty').bail().custom(value => {
            return User.findOne({ email: value }).then(user => { if(user) return Promise.reject('Email is already taken')} );
        }),
        check('password').trim().escape().not().isEmpty().withMessage('Password cannot be empty').bail().isLength({ min: 5 }).withMessage('Password must be minimum 5 characters').bail(),
        handleValidation
    ],
    authLogin: [
        check('username').trim().escape().not().isEmpty().withMessage('Username cannot be empty').bail(),
        check('password').trim().escape().not().isEmpty().withMessage('Password cannot be empty').bail(),
        handleValidation
    ],
    authRefresh: [
        check('accessToken').trim().escape().not().isEmpty().withMessage('Access token cannot be empty').bail(),
        check('refreshToken').trim().escape().not().isEmpty().withMessage('Refresh token cannot be empty').bail(),
        handleValidation
    ],
    userCreate: [
        check('name').trim().escape().not().isEmpty().withMessage('Name cannot be empty').bail().isLength({ min: 3 }).withMessage('Name must be minimum 3 characters').bail(),
        check('username').trim().escape().not().isEmpty().withMessage('Username cannot be empty').bail().custom(value => {
            return User.findOne({ username: value }).then(user => { if(user) return Promise.reject('Username is already taken')} );
        }),
        check('email').trim().escape().not().isEmpty().withMessage('Email cannot be empty').bail().custom(value => {
            return User.findOne({ email: value }).then(user => { if(user) return Promise.reject('Email is already taken')} );
        }),
        check('password').trim().escape().not().isEmpty().withMessage('Password cannot be empty').bail().isLength({ min: 5 }).withMessage('Password must be minimum 5 characters').bail(),
        handleValidation
    ],
    userUpdate: [
        check('name').optional().trim().escape().not().isEmpty().withMessage('Name cannot be empty').bail().isLength({ min: 3 }).withMessage('Name must be minimum 3 characters').bail(),
        check('username').optional().trim().escape().not().isEmpty().withMessage('Username cannot be empty').bail().custom((value, { req }) => {
            return User.findOne({ username: value, _id: { $ne: req.params.id }}).then(user => { if(user) return Promise.reject('Username is already taken')} );
        }),
        check('email').optional().trim().escape().not().isEmpty().withMessage('Email cannot be empty').bail().custom((value, { req }) => {
            return User.findOne({ email: value, _id: { $ne: req.params.id } }).then(user => { if(user) return Promise.reject('Email is already taken')} );
        }),
        check('password').optional().trim().escape().not().isEmpty().withMessage('Password cannot be empty').bail().isLength({ min: 5 }).withMessage('Password must be minimum 5 characters').bail(),
        handleValidation
    ],
    ticketCreate: [
        check('title').trim().escape().not().isEmpty().withMessage('Title cannot be empty').bail().isLength({ min: 3 }).withMessage('Title must be minimum 3 characters').bail(),
        check('description').trim().escape().not().isEmpty().withMessage('Description cannot be empty').bail().isLength({ min: 3 }).withMessage('Description must be minimum 3 characters').bail(),
        check('priority').trim().escape().not().isEmpty().withMessage('Priority cannot be empty').bail().isNumeric().withMessage('Priority must be a number').bail(),
        check('status').trim().escape().not().isEmpty().withMessage('Status cannot be empty').bail().custom(value => {
            if(!Ticket.statuses.includes(value)) throw new Error(`Status is invalid. Please provide any of: ${Ticket.statuses.join()}`);
        }),
        handleValidation
    ],
    ticketUpdate: [
        check('title').optional().trim().escape().not().isEmpty().withMessage('Title cannot be empty').bail().isLength({ min: 3 }).withMessage('Title must be minimum 3 characters').bail(),
        check('description').optional().trim().escape().not().isEmpty().withMessage('Description cannot be empty').bail().isLength({ min: 3 }).withMessage('Description must be minimum 3 characters').bail(),
        check('priority').optional().trim().escape().not().isEmpty().withMessage('Priority cannot be empty').bail().isNumeric().withMessage('Priority must be a number').bail(),
        check('status').optional().trim().escape().not().isEmpty().withMessage('Status cannot be empty').bail().custom(value => {
            if(!Ticket.statuses.includes(value)) throw new Error(`Status is invalid. Please provide any of: ${Ticket.statuses.join()}`);
            return true;
        }),
        handleValidation
    ],
    notificationCreate: [
        check('subject').trim().escape().not().isEmpty().withMessage('Subject cannot be empty').bail().isLength({ min: 3 }).withMessage('Subject must be minimum 3 characters').bail(),
        check('body').trim().escape().not().isEmpty().withMessage('Body cannot be empty').bail().isLength({ min: 3 }).withMessage('Body must be minimum 3 characters').bail(),
        check('emails').not().isArray().withMessage('Emails must be an array').bail(),
        check('ticketId').trim().escape().not().isEmpty().withMessage('Ticket ID cannot be empty').bail().custom(async value => {
            if(!isObjectId(value) || (await Ticket.count({ _id: value })) < 1) throw new Error(`Ticket is invalid. Please provide valid ticket ID`);
        }),
        handleValidation
    ],
}