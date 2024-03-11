const express =require('express');
const app =express();
const mongoose = require("mongoose");
const cors = require('cors')

const dotenv = require("dotenv")

require('./config/DbConnection');

dotenv.config();

 
const PORT=5555

app.use(cors())

app.use(express.json());

const user_Route = require("./routes/userRoutes")
app.use('/api',user_Route)

const room_route= require("./routes/roomRoutes")
app.use('/api',room_route)

const expnsRoute = require('./routes/expenseRoute')
app.use('/api',expnsRoute)

const donate_Route= require('./routes/donateRoute')
app.use('/api',donate_Route)

app.listen(PORT,()=>{
    console.log(`server is started at port ${PORT}` );
})

