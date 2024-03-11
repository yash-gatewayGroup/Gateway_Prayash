const Room = require("../model/RoomModel");
const User = require("../model/userModel");

const createRoom = async(req,res)=>{

    if (!req.body.users ||!req.body.title|| !req.body.description ){
        return res.status(400).send({msg:"please fill the fields"})
    }

    let users =req.body.users
 
    users.push(req.user)
    try {
        const room = await Room.create({
            title:req.body.title,
            description:req.body.description,
            users:users,
            groupAdmin:req.user,
            // Adminfname:req.user.fname
        });
        const roomdata= await Room.findOne({_id:room._id})
        .populate('users',"-password")
        .populate("groupAdmin","-password",);
        res.status(201).json({"data":roomdata})

    } catch (error) {
       res.status(200);
       throw new Error (error.message);
    }

}



//fetch loggedin which user is in which room

const fetchRoombyId= async(req,res)=>{
    try {
        
      const roomdetail= await Room.find({users:{$elemMatch:{$eq:req.user._id}}})    
        res.status(200).send(roomdetail)
    } catch (error) {
        res.status(400);
        throw new Error(error.message   )
        
    }
}


//fetch all rooms

const fetchallrooms = async(req,res)=>{
  
    try {
        const allrooms= await Room.find(
        ).sort({$natural:-1}).populate("groupAdmin")
   
        res.status(201).json(allrooms)
        // console.log(allrooms)
    } catch (error) {
        res.status(422).json(error);
    }

}
//fetch room by room id

const individualroom =async(req,res)=>{
    const {id} = req.params;
    try {
       
        const roombyid = await Room.findById({_id:id}).populate("users","-password")
        .populate("groupAdmin","-password")
       
        res.status(201).json(roombyid)
    } catch (error) {
        res.status(422).json(error);
    }
}



const deleteRoom = async(req,res)=>{
    try {
        const {id} = req.params;

        const deletroom = await Room.findByIdAndDelete({_id:id})
        console.log(deletroom);
        res.status(201).json({success:true,msg:"Room deleted"});

    } catch (error) {
        res.status(422).json({success:false,msg:"error"});
    }
}

const updateRoom =async(req,res)=>{
    try {
        const {id}= req.params;
        const updateRoom = await Room.findByIdAndUpdate(
            {_id:id},{
                $set:{
                    title:req.body.title,
                    description:req.body.description
                }
            },{
                new:true
            }

        ).populate("users","-password")
        .populate("groupAdmin","-password")
            res.status(201).json({success:true,msg:"Room updated",data:updateRoom})

    } catch (error) {
        res.status(422).json("Room not found");
    }
}

//add memnber to group aftrer creation
const addMembers = async(req,res)=>{
    try {
         const {id} = req.params
         const {userid}= req.body
      
        const room = await Room.findById(id)
        const newUsers=[];
        const existingusers= [];
        for(let i=0;i<userid.length;i++){
            const user = userid[i]
            if (room.users.includes(user)){
                existingusers.push(user);
            }else{
                newUsers.push(user)               
                room.users.push(user)
           }
       }
     
   const addtoRoom= await room.save()
        const response = {
           message: 'Users added successfully',
           newUsers,
           existingusers,
           addtoRoom
         };
     
         res.status(200).json(response);
    } catch (error) {
        res.status(422).json(error);     
        console.log(error)  
    }
}

const RemoveMembers = async(req,res)=>{
    try {
        const {id} = req.params
        const {userid}= req.body
        const removeFromRoom = await Room.findByIdAndUpdate(id,{
           $pull:{users:userid},
        },{new:true}).populate("users","-paswword").populate("groupAdmin","-password")
      
        res.status(201).json({success:true,msg:"User Removed",data:removeFromRoom})
        
    } catch (error) {
        res.status(422).json(error);  
        console.log(error) 
    }
}


//this api is not DIRECT HITTED API IT IS CALLED BY ADD EXPENSE FUNCTION
const Roomtotalexp =async(Roomtitle,amount)=>{
    var room = await Room.findOne({
        _id:Roomtitle
    })
    room.Roomtotalexpense =room.Roomtotalexpense + amount
    return await Room.updateOne({
        _id:Roomtitle
    },room)
}


module.exports={createRoom,fetchRoombyId,fetchallrooms, individualroom ,deleteRoom,updateRoom,Roomtotalexp,addMembers,RemoveMembers}
