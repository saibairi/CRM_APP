const express = require("express");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const validator = require("../middlewares/validators");
const {authenticate,authorize} = require("../middlewares/auth");
const ticketController = require("../controllers/ticket.controller");
const notificationController = require("../controllers/notification.controller");
const auth = require("../middlewares/auth");

const apiRouter = express.Router();
const apiRouterSecure = express.Router();

apiRouter.get('/', (req,res)=>{
    res.status(200).send({
        message : "you have reached API service successfully...!!"
    });
});

apiRouter.route("/register").post(validator.authRegister,authController.register);
apiRouter.route("/login").post(validator.authLogin, authController.login);
apiRouter.route("/logout").post(authController.logout);
apiRouter.route("/refresh").post(validator.authRefresh, authController.refresh);

apiRouterSecure.use(authenticate);

apiRouterSecure.route("/users")
.get(authorize,userController.index)
.post(authorize, validator.userCreate, userController.create);

apiRouterSecure.route("/users/:id")
.get(authorize, userController.read)
.put(authorize, validator.userUpdate, userController.update);

apiRouterSecure.route("/tickets")
.get(ticketController.index)
.post(validator.ticketCreate, ticketController.create);

apiRouterSecure.route("/ticket/:id")
.get(ticketController.read)
.put(validator.ticketUpdate,ticketController.update)
.delete(ticketController.destroy);

apiRouterSecure.route("/tickets/:id/notifications").get(notificationController.indexByTicket);
apiRouterSecure.route("/notifications").post(validator.notificationCreate, notificationController.create);

module.exports = {
    apiRouter : apiRouter,
    apiRouterSecure : apiRouterSecure
};