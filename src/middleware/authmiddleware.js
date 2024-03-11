const jwt = require("jsonwebtoken")

const user = require('../model/userModel')
const {roles} = require('../constants/constants')

const dotenv = require("dotenv")
dotenv.config();
const sctjwt = process.env.secret_jwt

const verifyToken = async(req,res,next)=>{
        const token = req.body.token || req.query.token || req.headers["authorization"]

        

        if(!token){
          return   res.status(200).send({success:false,msg:"A token is required for authentication"});
        }
        try {
            const decode=await jwt.verify(token,sctjwt)
            req.user = decode  //_id, role
           // console.log("data : ",decode.role); 
            //console.log(decode)
        } catch (error) {
            // res.status(400).send("Invalid token")
            
        }
        next();
}

const isAdmin = async (req, res, next) => {
  // const ADMIN = await user.find({role :"ADMIN"});
console.log(req.user.role)
console.log(req.user._id.fname)

  if (req.user.role === "ADMIN") {
    next();
  } else {
    res.status(401).send({
      message: "User is not Admin",
    });

  }
};
const isCoreMember = async (req, res, next) => {
 
console.log(req.user.role)
console.log(req.user._id.fname)

  if (req.user.role === "CoreMember") {
    next();
  } else {
    res.status(401).send({
      message: "User is not coremember",
    });

  }
};




module.exports = {verifyToken,isAdmin,isCoreMember}

