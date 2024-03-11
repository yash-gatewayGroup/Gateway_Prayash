const mongoose = require ("mongoose")


const roomSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },

  
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    }],
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    Roomtotalexpense:{
        type:Number,
        default:0
    }

    // Adminfname:{
    //     type:String,
    //     ref:"Users"

    // }
},
    {
        timestamps:true

    }



)

const Room = mongoose.model("Rooms",roomSchema);
module.exports=Room