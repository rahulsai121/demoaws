const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../model/user');
const expense = require('../model/expense');

require('dotenv').config();

exports.userpost = async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const newuser = await user.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
    });

    res.status(201).json({ message: 'User created successfully' });
};

exports.loginpost = async (req, res) => {
    const userdata = await user.findAll({ where: { email: req.body.email } });

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
    const userid = jwt.verify(req.body.userid, 'secretkey');

    const newexpence = await expense.create({
        amount: req.body.amount,
        des: req.body.des,
        category: req.body.category,
        userid: userid.id
    });

    res.status(201).json({ newexpence });
};

exports.expensedelete = async (req, res) => {
    const result = expense.destroy({ where: { id: req.params.id } })
        .then(() => res.status(204))
        .catch(err => console.log(err));

    res.status(204);
};

exports.expenseget = async (req, res) => {
    try {
        const decodetoken = jwt.verify(req.headers.authorization, 'secretkey');
        const expensedata = await expense.findAll({ where: { userid: decodetoken.id } });
        res.status(200).json(expensedata);
    } catch (error) {
        console.error('Error retrieving expense data:', error);
        res.status(400).json({ error: 'Internal Error' });
    }
};
