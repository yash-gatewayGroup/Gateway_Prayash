const mongoose = require('mongoose');
const dotenv = require("dotenv")
dotenv.config();
const DB= "mongodb+srv://gateway-utsav:I8GkNtAAA3r7dYVR@cluster0.hpqldam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(DB).then(()=>{
    console.log("connection succesful")
}).catch((err )=>console.log(err.message))

module.exports = {
    mongoose
};