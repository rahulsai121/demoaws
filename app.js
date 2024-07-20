const express=require('express')
const cors=require('cors')
const controller=require('./controller/controller')
const sequelize = require('./utility/database');

const User=require('./model/user')
const Order=require('./model/orders')

const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.post('/user/signup',(req,res,next)=>{
    controller.userpost(req,res)
})

app.post('/user/login',(req,res,next)=>{
    controller.loginpost(req,res)
})

app.post('/user/expense',(req,res,next)=>{
    controller.expensepost(req,res)
})
app.delete('/user/expense/:id',(req,res)=>{
    controller.expensedelete(req,res)
})
app.get('/user/expense',(req,res)=>{
    controller.expenseget(req,res)
})

app.get('/purchase/premium',(req,res)=>{
    controller.premiumget(req,res)
})

app.post('/purchase/updateTransactionStatus',(req,res)=>{
    controller.updateTransaction(req,res)
})

User.hasMany(Order)
Order.belongsTo(User)

sequelize.sync()
    .then(() => {
        console.log('Database synced');
        app.listen(3000, () => {
            console.log('Server is running');
        });
})

