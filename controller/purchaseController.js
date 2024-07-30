const Razorpay = require('razorpay');
const jwt = require('jsonwebtoken');

const Orders = require('../model/orders');
const User = require('../model/user');
const Expense=require('../model/expense');
const sequelize=require('../utility/database');
const order = require('../model/orders');

require('dotenv').config();

exports.premiumget = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret
        });
        const amount = 500;
        const user = jwt.verify(req.headers.authorization, 'secretkey');

        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
            if (err) {
                throw new Error(err);
            } else {
                Orders.create({ orderid: order.id, status: 'pending', userId: user.id })
                    .then(() => {
                        return res.status(201).json({ order, key_id: rzp.key_id });
                    });
            }
        });

    }

     catch (error) {
        console.error('Error retrieving razorpay:', error);
        res.status(400).json({ error: 'Internal Error' });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        Orders.findOne({ where: { orderid: order_id } })
            .then(order => {
                order.update({ paymentid: payment_id, status: 'SUCCESSFUL' })
                    .catch(err => console.log(err));
                User.findOne({ where: { id: order.userId } })
                    .then(user => {
                        user.update({ ispremiumuser: true })
                            .then(() => {
                                const decode = jwt.decode(req.headers.authorization);
                                decode.ispremium = true;
                                const newToken = jwt.sign(decode, 'secretkey');
                                res.status(202).json({ newToken, success: true, message: 'transaction completed' });
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            });
    }

    catch (err) {
        console.log(err);
    }
};

exports.getUserLeaderBoard=async(req,res)=>{
    try{
        const leaderBoardDetails=await User.findAll({
            attributes:['id','name',[sequelize.fn('sum',sequelize.col('expences.amount')),'total_amount']],
            include:[{
                model:Expense,
                attributes:[]
            }],
            group:['id'],
            order:[['total_amount','DESC']]
        })
        //console.log(leaderBoardDetails)
        res.status(201).json({leaderBoardDetails})

    }
    catch (err){
        console.log(err)
    }
}
