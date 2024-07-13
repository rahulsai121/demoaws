const bcrypt = require('bcrypt');

const user=require('../model/user')
exports.userpost= async (req, res) => {
    //console.log(req.body)

    
    const hash=await bcrypt.hash(req.body.password,10)
    const newuser= await user.create({
        name:req.body.name,
        email:req.body.email,
        password:hash
    })

    res.status(201).json({ message: 'User created successfully'});
}

exports.loginpost=async(req,res)=>{

    const userdata= await user.findAll({where:{email:req.body.email}})
    
    console.log('-------------',userdata)
    
    if(userdata.length>0){
        
        const match=await bcrypt.compare(req.body.password,userdata[0].password)
        console.log('match------------',match)
        if(match){
            res.status(200).json({message:'User login successfull'})
        }
        else{
            res.status(401).json({message:'User not authorized'})
        }
    }
    else{
        return res.status(404).json({message:'User not found'})
    }
}