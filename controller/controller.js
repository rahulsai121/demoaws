const bcrypt = require('bcrypt');

const user=require('../model/user')

const expense=require('../model/expense')
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
        
        if(match){
            res.status(200).json({message:'User login successfull',success:true})
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
    const newexpence=await expense.create({
        amount:req.body.amount,
        des:req.body.des,
        category:req.body.category
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
        const expensedata = await expense.findAll(); // Assuming 'expense' is your Sequelize model
        res.status(200).json(expensedata); // Corrected syntax: use parentheses for json method
    } catch (error) {
        console.error('Error retrieving expense data:', error);
        res.status(400).json({ error: 'Internal Error' });
    }
}