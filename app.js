const express=require('express')
const cors=require('cors')
const helmet=require('helmet')
const fs = require('fs')
const morgan = require('morgan')
const path = require('path')


const sequelize = require('./utility/database');
const User=require('./model/user')
const Order=require('./model/orders')
const Expense=require('./model/expense')
const ForgotPasswordRequests=require('./model/ForgotPasswordRequests')
const downloadedexpenses=require('./model/downloadedexpenses')


const userRoutes = require('./routes/user');
const purchaseRoutes = require('./routes/purchase');
const passwordRoutes = require('./routes/password');


const app=express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet())

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
 


app.use('/user', userRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/password', passwordRoutes);
app.use(morgan('combined', { stream: accessLogStream }))




User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(ForgotPasswordRequests)
ForgotPasswordRequests.belongsTo(User)


User.hasMany(downloadedexpenses)
downloadedexpenses.belongsTo(User)

sequelize.sync()
    .then(() => {
        console.log('Database synced');
        app.listen(3000, () => {
            console.log('Server is running');
        });
})

