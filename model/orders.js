const Sequelize=require('sequelize')
const sequelize=require('../utility/database')

const order=sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
      },
    paymentid:{
        type:Sequelize.STRING,
    },
    orderid:{
        type:Sequelize.STRING,
        
    },
    status:{
        type:Sequelize.STRING,
    },
    userId:{
        type:Sequelize.INTEGER,
    }
})

module.exports=order;