 //we have to register the user so we have to require this model
const User = require("../model/userModel");
//used to hash the password
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const jwt = require("jsonwebtoken"); 

const dotenv = require("dotenv")
dotenv.config();
const sctjwt = process.env.secret_jwt

const create_token = async (id, name,role)=>{
    //confusion
    try {
       const token = await jwt.sign({_id:id,name:name,role:role},sctjwt);
    //    this.tokens = this.tokens.concat({ token: token })
       return token;
    } catch (error) {
      throw error;
    }
}

//
const registerUser = async (req, res) => {

    try {

        const user = new User({

            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            gender: req.body.gender,
            mobile: req.body.mobile,
            address: req.body.address,
            password: req.body.password,
            cpassword: req.body.cpassword,
            state:req.body.state,
            country:req.body.country,
            city:req.body.city,
            // RoomId
          

 
        });

        // if (!user.fname ||!user.lname || !user.email || !user.gender|| !user.mobile || !user.address || !user.password || !user.cpassword ||!user.state ||!user.country ||!user.city) {
          
        //     return res.status(422).json({ err: "please fill" })
            
        // }
        const userData = await User.find({ email: user.email })
        // console.log(userData)
        if (userData && userData === null) {
            return res.status(422).json({ err: "email already exists" })
        }
        else if (user.password != user.cpassword) {
            return res.status(422).json({ err: "password doesnot matches" })
        } else {

            const user_data = await user.save()
            res.status(200).send({ success: true, data: user_data })
        }


    } catch (error) {
        res.status(400).send(error.message);
        console.log(error)

    }
}


//user login
const user_login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "please fill" })
        }
        const userLogin = await User.findOne({ email: email });
        if (userLogin) {
            //paswword checking
            const isMatch = await bcrypt.compare(password, userLogin.password)
            if (!isMatch) {
                res.status(400).json({ error: "invalid credintials " })
            } else {
                const tokenData = await create_token(userLogin._id,userLogin.name,userLogin.Role)
                // console.log(tokenData)
                res.cookie("usercookie",tokenData,{
                    expires:new Date(Date.now()+9000000),
                    httpOnly:true
                  })
                  const result={
                    userLogin,
                    tokenData
                  }
                  res.status(201).json({status:201,result})
           
            }
        } else {
            res.status(400).json({ error: "invalid credintials" })
        }
    } catch (err) {
        console.log(err)
    }
}


const getUsersData=async(req,res,next)=>{
    const data=await User.findById(req.user._id);

    if(!data){
        res.status(500).json({
            message:"There is no any users in database"
        })
    }

    res.status(200).json({
        message:"successfully retrived",
        data
    })
}

//allusers
const allusers =async(req,res)=>{
    try {
        try {
            const userdata = await User.find();
            res.status(201).json(userdata)
            // console.log(userdata);
        } catch (error) {
            res.status(422).json(error);
        }
    } catch (error) {
        res.status(422).json(error);
        
    }
}
const allmembers =async(req,res)=>{
    try {
        try {
            const memberdata = await User.find({Role:"Member"}).sort({$natural:-1}).select("-password").select("-cpassword");
            res.status(201).json(memberdata)
            // console.log(memberdata);
        } catch (error) {
            res.status(201).json({success:true ,data:memberdata});
        }
    } catch (error) {
        res.status(422).json(error);
        
    }
}
const coreMembers =async(req,res)=>{
    try {
        try {
            const corememberdata = await User.find({Role:"CoreMember"}).sort({$natural:-1}).select("-password").select("-cpassword");
            res.status(201).json(corememberdata)
            console.log(corememberdata);
        } catch (error) {
            res.status(201).json({success:true ,data:corememberdata});
        }
    } catch (error) {
        res.status(422).json(error);
        
    }
}

//search users

const searchUser = async(req,res)=>{
    const keyword = req.query.search? {
        $or:[
             
            {email:{$regex:req.query.search,$options:"$i"}}
        ]
    }:{};

    
    const users = await User.find(keyword)
    // .find({_id:{$ne:req.user._id}})
   
    res.send(users)

}
 const RoleUpdate= async(req,res)=>{
     try {
         const {id} = req.params
         const user = await User.findById({_id:id})
         if(user.Role==="CoreMember"){
         return res.status(409).json({message:`User ${user.fname + " " + user.lname} is already a coremember`})
         }
             user.Role = "CoreMember"
         
       const updatedata =  await user.save()
         res.status(201).json({success:true ,message:`User ${user.fname} has been updated to coremember `,data:updatedata })
     } catch (error) {
        res.status(500).json("server error");
         
   
 }
 }   
 const Roledemote= async(req,res)=>{
     try {
         const {id} = req.params
         const user = await User.findById({_id:id})
         if(user.Role==="Member"){
         return res.status(409).json({message:`User ${user.fname + " " + user.lname} is already a member`})
         }
             user.Role = "Member"
         
             const updatedata=await user.save()
         res.status(201).json({success:true ,message:`User ${user.fname + "  " + user.lname} has been demoted to member `,data:updatedata})
     } catch (error) {
        res.status(500).json("server error");
         
   
 }
 }   

module.exports = {
   registerUser,
    user_login,
    getUsersData,
    allusers,
    searchUser,allmembers ,coreMembers,RoleUpdate,Roledemote}
















    // try {
    //     const { id } = req.params
    //     const { userid } = req.body

    //     const room = await Room.findById(id)

      
    //      const existingusers= [];
    //      for(let i=0;i<userid.length;i++){
    //          const user = userid[i]
    //          if (room.users.includes(user)){
    //              existingusers.push(user);
    //          }else{
    //             //  newUsers.push(user);
    //             //  room.users.push(user)
    //             const addtoRoom = await Room.findByIdAndUpdate(id, {
    //                 $push: { users: userid },
    //             }, { new: true }).populate("users", "-paswword").populate("users", "-password")
    //             res.status(201).json({ success: true, msg: "User Added", data: addtoRoom })

    //         }
    //     }
         
    //    const addtoroom =   await room.save().populate("users","-password").populate("groupAdmin","-password")
    // const addtoRoom= await room.save()
    //      const response = {
    //         message: 'Users added successfully',
    //         newUsers,
    //         existingusers,
    //       };
      
    //       Send the response
    //       res.status(200).json(response);
        
        // userid.forEach(user => {
        //     if (room.users.includes(user)) {
        //         res.status(401).json(`User ${userid} is already in the group`)
        //     }else{
                
        //         room.users.push(userid)
            // } })
           
                // const addtoRoom = await Room.findByIdAndUpdate(id, {
                //     $push: { users: userid },
                // }, { new: true }).populate("users", "-paswword").populate("users", "-password")
                // res.status(201).json({ success: true, msg: "User Added", data: addtoRoom })