const express = require("express");
const room_Route=express();

room_Route.use(express.json())
const {verifyToken} = require('../middleware/authmiddleware')

const path = require("path");
const { createRoom ,fetchRoombyId,fetchallrooms,individualroom,deleteRoom,updateRoom,addMembers,RemoveMembers} = require("../controller/roomController");

// const room_Controller = ('../controller/roomController.js')



room_Route.post('/createroom',verifyToken,createRoom)

room_Route.get('/fetchroom',verifyToken,fetchRoombyId)
room_Route.get('/fetchallroom',fetchallrooms);
room_Route.get('/fetchroombyid/:id',individualroom);
room_Route.delete('/deleteroombyid/:id',deleteRoom);
room_Route.put('/updateroombyid/:id',updateRoom);
room_Route.patch('/room/:id/users',addMembers);
room_Route.patch('/roomremovemember/:id/users',RemoveMembers);


// room_Route.put('/addtogroup',verifyToken,addToGroup);


module.exports= room_Route