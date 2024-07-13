const { where } = require('sequelize')
const user=require('../model/user')
exports.userpost= async (req, res) => {
    //console.log(req.body)
    const newuser= await user.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })

    //res.send(newpost.dataValues)
}

exports.loginpost=async(req,res)=>{
    console.log(req.body)
    const userdata= await user.findAll({where:{email:req.body.email}})
    console.log('---------',userdata)
    
    if(userdata.length>0){
        if(userdata[0].password===req.body.password){
            res.send({message:'User login successfull'})
        }
        else{
            res.send({message:'User not authorized'})
        }
    }
    else{
        res.send({message:'User not found'})
    }
}