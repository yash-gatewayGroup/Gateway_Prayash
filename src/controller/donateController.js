const Donate = require ("../model/donateModel");

const adddonate = async(req,res)=>{
try {
    
    const donate = new Donate({
        title:req.body.title,
        purpose:req.body.purpose,
        amount:req.body.amount,
        Roomtitle:req.body.Roomtitle   
    })
  
    var donate_data = await donate.save();
    res.status(200).send({success:true,msg:"Donate details",data:donate_data})
    
} catch (error) {
    res.status(400).send({success:false,msg:error.message})
}
}

const donateGet = async (req,res)=>{
    try {
        const donate= await Donate.find().sort({$natural:-1})
        res.status(201).json({success:true,msg:"Donate details",data:donate})
    } catch (error) {
        res.status(422).json({success:false,msg:"error"});
    }         
}
module.exports ={
    adddonate,donateGet
}