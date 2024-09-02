const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Expense = require('../model/expense');
const Downloadedexpencestable=require('../model/downloadedexpenses');
const sequelize = require('../utility/database');
const AWS = require('aws-sdk');

const uploadToS3 = require('../services/awsS3Service');


require('dotenv').config();

exports.userpost = async (req, res) => {
    
    const hash = await bcrypt.hash(req.body.password, 10);
    const newuser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
    });

    res.status(201).json({ message: 'User created successfully' });
};

exports.loginpost = async (req, res) => {
    const userdata = await User.findAll({ where: { email: req.body.email } });

    if (userdata.length > 0) {
        const match = await bcrypt.compare(req.body.password, userdata[0].password);'secretkey'

        if (match) {
            const token = jwt.sign({ id: userdata[0].id, ispremium: userdata[0].ispremiumuser },process.env.JWT_SECRET_KEY );
            res.status(200).json({ token: token, success: true });
        } else {
            res.status(401).json({ message: 'User not authorized', success: false });
        }
    } else {
        res.status(404).json({ message: 'User not found', success: false });
    }
};

exports.expensepost = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const userid = jwt.verify(req.body.userid, 'secretkey');


        const newExpense = await Expense.create({
            amount: req.body.amount,
            des: req.body.des,
            category: req.body.category,
            userId: userid.id
        }, { transaction: t });


        const user = await User.findOne({
            where: { id: userid.id }
        });

        let totalAmount = user.totalamount || 0

        totalAmount += Number(req.body.amount)

        const userupdate = await User.update(
            { totalamount: totalAmount },
            { where: { id: userid.id }, transaction: t }
        )

        await t.commit();
        res.status(201).json({ newExpense });

    } catch (error) {
        await t.rollback();
        console.error('Error in expensepost:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.expensedelete = async (req, res) => {
    try {
        const result = await Expense.destroy({ where: { id: req.params.id } });

        const userid = jwt.verify(req.query.userid, 'secretkey');

        const user = await User.findOne({
            where: { id: userid.id }
        });


        let totalAmount = user.totalamount || 0;
        totalAmount -= Number(req.query.amount);

        await User.update(
            { totalamount: totalAmount },
            { where: { id: userid.id } }
        );

        res.status(204); // Send no content on successful deletion and update
    } catch (error) {
        console.error('Error in expensedelete:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.expenseget = async (req, res) => {
    try {
        const decodetoken = jwt.verify(req.headers.authorization, 'secretkey');
        //const expensedata = await Expense.findAll({ where: { userid: decodetoken.id } });

        const page = req.query.page
        const totalNumberOfExpenses = await Expense.count({where: { userid: decodetoken.id }})

        const limit = parseInt(req.query.limit)
        const expensedata = await Expense.findAll({
            where: { userid: decodetoken.id },
            offset: (page - 1) * (limit),
            limit: limit
        })
        res.status(200).json({
            expenses: expensedata,
            currentPage: page,
            hasNextPage: limit * page < totalNumberOfExpenses,
            nextPage: Number(page) + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalNumberOfExpenses / limit)
        });
    } catch (error) {
        console.error('Error retrieving expense data:', error);
        res.status(400).json({ error: 'Internal Error' });
    }
};

exports.downloadexpense = async (req, res) => {
    try {
        const decodetoken = jwt.verify(req.headers.authorization, 'secretkey');

        const expenses = await Expense.findAll({ where: { userId: decodetoken.id } })

        const stringfiedExpenses = JSON.stringify(expenses)
        const filename = `Expense${decodetoken.id}/${new Date()}.txt`

        const fileURl = await uploadToS3(stringfiedExpenses, filename,)
        
        res.status(201).json(fileURl)
    }
    catch (error) {
        console.error('Error in downloadexpense:', error);
        res.status(400).json({ error: 'Internal Error' });
    }

}

exports.downloadexpensetable=async(req,res)=>{
    try{
        const decodetoken = jwt.verify(req.body.token, 'secretkey');

        const newdownloadedexpensetable=await Downloadedexpencestable.create({
            fileUrl:req.body.fileUrl,
            userId:decodetoken.id
        })
        res.status(201).json(newdownloadedexpensetable)
    }
    catch(error){
        
        console.error('Error in downloadexpensetable:', error);
        res.status(400).json({ error: 'Internal Error' });
    }
}
exports.getdownloadexpensetable=async(req,res)=>{
    try{
        const decodetoken = jwt.verify(req.headers.authorization, 'secretkey');

        const table=await Downloadedexpencestable.findAll({
            where:{
                userId:decodetoken.id

            }
        })
        res.status(200).json({table})

    }
    catch(error){
        
        console.error('Error in getdownloadexpensetable:', error);
        res.status(400).json({ error: 'Internal Error' });
    }
}