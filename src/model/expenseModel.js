const mongoose = require("mongoose");


const expenseSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true
    },
    image:{
      type:String,
      // required:true
   default:"https://icons.veryicon.com/png/o/internet--web/55-common-web-icons/person-4.png"
  },
    // RoomId:{
    //     type:mongoose.Schema.Types.ObjectId,
    //    ref:"Rooms"
    // },
    // RoomName:{
    //     type:String,
    //    ref:"Rooms"
    // },
    Roomtitle:{
      type:mongoose.Schema.Types.ObjectId,
     ref :"Rooms"

    },
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    // name: {
      
    //     type:String,
    //     ref: "Users",
    //   }

    },

   {
    timestamps: true,
  })


module.exports= mongoose.model("Expense",expenseSchema )