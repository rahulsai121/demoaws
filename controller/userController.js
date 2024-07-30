const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Expense = require('../model/expense');
const { where } = require('sequelize');

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
        const match = await bcrypt.compare(req.body.password, userdata[0].password);

        if (match) {
            const token = jwt.sign({ id: userdata[0].id, ispremium: userdata[0].ispremiumuser }, 'secretkey');
            res.status(200).json({ token: token, success: true });
        } else {
            res.status(401).json({ message: 'User not authorized', success: false });
        }
    } else {
        res.status(404).json({ message: 'User not found', success: false });
    }
};

exports.expensepost = async (req, res) => {
    try {
        const userid = jwt.verify(req.body.userid, 'secretkey');

        // Create new expense
        const newExpense = await Expense.create({
            amount: req.body.amount,
            des: req.body.des,
            category: req.body.category,
            userId: userid.id
        });

        // Find the user and update total amount
        const user = await User.findOne({
            where: { id: userid.id }
        });

        let totalAmount = user.totalamount ||0

        totalAmount+=Number(req.body.amount)

        await User.update(
            { totalamount: totalAmount },
            { where: { id: userid.id } }
        );

        res.status(201).json({ newExpense });

    } catch (error) {
        console.error('Error in expensepost:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.expensedelete = async (req, res) => {
    const result = Expense.destroy({ where: { id: req.params.id } })
        .then(() => res.status(204))
        .catch(err => console.log(err));

    res.status(204);
};

exports.expenseget = async (req, res) => {
    try {
        const decodetoken = jwt.verify(req.headers.authorization, 'secretkey');
        const expensedata = await Expense.findAll({ where: { userid: decodetoken.id } });
        res.status(200).json(expensedata);
    } catch (error) {
        console.error('Error retrieving expense data:', error);
        res.status(400).json({ error: 'Internal Error' });
    }
};
