const express=require('express')
const cors=require('cors')
const controller=require('./controller/controller')
const sequelize = require('./utility/database');



const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/user/submit',(req,res,next)=>{
    controller.userpost(req,res)
})

sequelize.sync({force:true})
    .then(() => {
        console.log('Database synced');
        app.listen(3000, () => {
            console.log('Server is running');
        });
})

