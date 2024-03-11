const express = require("express");
const { verify } = require("jsonwebtoken");
const user_route = express();

user_route.use(express.json());
const path = require("path");
const user_controller = require("../controller/userController");
const {verifyToken,isAdmin,isCoreMember}= require('../middleware/authmiddleware')

user_route.use(express.static('public'));
user_route.post ('/register',user_controller.registerUser);

user_route.post('/login',user_controller.user_login);
user_route.get('/allusers',user_controller.allusers);

user_route.get('/allmembers',user_controller.allmembers);
user_route.get('/allcoremembers',user_controller.coreMembers)
user_route.get("/susers",verifyToken,user_controller.searchUser);
user_route.patch("/upgrade/:id",user_controller.RoleUpdate);
user_route.patch("/downgrade/:id",user_controller.Roledemote);


module.exports=user_route
