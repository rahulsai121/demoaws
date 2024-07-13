const express=require('express')
const cors=require('cors')
const controller=require('./controller/controller')
const sequelize = require('./utility/database');



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

sequelize.sync()
    .then(() => {
        console.log('Database synced');
        app.listen(3000, () => {
            console.log('Server is running');
        });
})

