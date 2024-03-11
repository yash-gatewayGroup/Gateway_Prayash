const express = require("express");
const expenseRoute = express();

const {addexpense,expenseGet,expensedelete,updatexpense,individualexpense,userExpense}= require('../controller/expenseController');
const {verifyToken,isCoreMember} = require('../middleware/authmiddleware')


expenseRoute.use(express.json());
expenseRoute.post('/expenseadd',addexpense)
expenseRoute.get('/expenseget',expenseGet)
expenseRoute.delete('/expensedelete/:id',expensedelete)
expenseRoute.put('/expenseupdate/:id',updatexpense)
expenseRoute.get('/expensebyid/:id',individualexpense)
//get expense of loged in user

expenseRoute.get('/expenseuser',verifyToken,userExpense)



module.exports =expenseRoute



