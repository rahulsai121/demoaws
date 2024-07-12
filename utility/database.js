const Sequelize=require('sequelize')

const sequelize=new Sequelize('aws','root','Rahul55555',{
    dialect:'mysql',
    host:'localhost'
});

module.exports=sequelize;