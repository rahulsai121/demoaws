const express=require('express')
const cors=require('cors')
const sequelize = require('./utility/database');


const User=require('./model/user')
const Order=require('./model/orders')
const Expense=require('./model/expense')


const userRoutes = require('./routes/user');
const purchaseRoutes = require('./routes/purchase');


const app=express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/user', userRoutes);
app.use('/purchase', purchaseRoutes);



User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Expense)
Expense.belongsTo(User)


sequelize.sync()
    .then(() => {
        console.log('Database synced');
        app.listen(3000, () => {
            console.log('Server is running');
        });
})

