const bcrypt = require('bcrypt');

const user=require('../model/user')

const jwt = require('jsonwebtoken');

const expense=require('../model/expense');

const Razorpay=require('razorpay')

const Orders=require('../model/orders');
const { where } = require('sequelize');

require('dotenv').config();

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

    if(userdata.length>0){
        
        const match=await bcrypt.compare(req.body.password,userdata[0].password)
        
        if(match){
            const token=jwt.sign({id:userdata[0].id,ispremium:userdata[0].ispremiumuser},'secretkey')

           // const decode=jwt.verify(token,'secretkey')
           //console.log('decode---------',userdata[0].ispremiumuser)

            res.status(200).json({token:token,success:true})
        }
        else{
            res.status(401).json({message:'User not authorized',success:false})
        }
    }
    else{
        res.status(404).json({message:'User not found',success:false})
    }
}

exports.expensepost=async(req,res)=>{
    const userid= jwt.verify(req.body.userid,'secretkey')

    const newexpence=await expense.create({
        amount:req.body.amount,
        des:req.body.des,
        category:req.body.category,
        userid:userid.id
    })

    res.status(201).json({newexpence})
}

exports.expensedelete=async(req,res)=>{

    const result=expense.destroy({where:{id:req.params.id}})
    .then(res=>res.status(204))
    .catch(err=>console.log(err))

    res.status(204)
}
exports.expenseget=async(req,res)=>{
    try {
        //console.log(req.headers.authorization)
        const decodetoken= jwt.verify(req.headers.authorization,'secretkey')
        
        const expensedata = await expense.findAll({where:{userid:decodetoken.id}}); // Assuming 'expense' is your Sequelize model
        res.status(200).json(expensedata); // Corrected syntax: use parentheses for json method
    } catch (error) {
        console.error('Error retrieving expense data:', error);
        res.status(400).json({ error: 'Internal Error' });
    }
}



////////////////////////////////razorpay
exports.premiumget=async(req,res)=>{
    try{
        var rzp=new Razorpay({
            key_id:process.env.key_id,
            key_secret:process.env.key_secret
        })
        //console.log('token----------',req.headers.authorization)
        const amount=500
        const user = jwt.verify(req.headers.authorization, 'secretkey');

         rzp.orders.create({amount,currency:'INR'},(err,order)=>{
            if(err){
                throw new Error(err)
            }
            else{
                //console.log(user)
                Orders.create({orderid:order.id,status:'pending',userId:user.id})
                .then(()=>{
                    return res.status(201).json({order,key_id:rzp.key_id})
                })
            }
            
        })
    } catch(error){
        console.error('Error retrieving razorpay:', error);
        res.status(400).json({ error: 'Internal Error' });

    }
}


exports.updateTransaction=async(req,res)=>{
    try{
        //console.log(req)
        const {payment_id,order_id}=req.body
        //console.log(payment_id,'--------------',order_id)
        Orders.findOne({where:{orderid:order_id}})
        .then(order=>{
            order.update({paymentid:payment_id,status:'SUCCESSFUL'})
            .catch(err=>console.log(err))
            user.findOne({where:{id:order.userId}})
            .then(user=>{
                user.update({ispremiumuser:true})
                .then(()=>{
                    const decode=jwt.decode(req.headers.authorization)
                    decode.ispremium=true;
                    const newToken=jwt.sign(decode,'secretkey')
                    res.status(202).json({newToken,success:true,message:'transaction completed'})})
                .catch(err=>console.log(err))
            })
            .catch(err=>console.log(err))
        })
        
        
    }
    catch(err){
        console.log(err)
    }
}