const Sequelize=require('sequelize')
const sequelize=require('../utility/database')

const expense=sequelize.define('expence',{
    id:{
      type:Sequelize.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true
    },
    amount:{
      type:Sequelize.INTEGER,
      allowNull:false,
    },
    des:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      userid:{
        type:Sequelize.INTEGER
      }
  })
  
  module.exports=expense;