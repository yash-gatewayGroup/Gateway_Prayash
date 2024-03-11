const express = require("express");
const donateRoute = express();

const {adddonate,donateGet}= require('../controller/donateController')
const {verifyToken} = require('../middleware/authmiddleware')


donateRoute.use(express.json());
donateRoute.post('/donateadd',adddonate)
donateRoute.get('/donateget',donateGet)



module.exports =donateRoute
