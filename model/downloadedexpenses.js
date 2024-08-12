const Sequelize=require('sequelize')
const sequelize=require('../utility/database')

const table=sequelize.define('downloadedexpenses',{
    id:{
      type:Sequelize.INTEGER,
      autoIncrement:true,
      primaryKey: true,
      allowNull:false,
    },
    fileUrl:{
      type:Sequelize.TEXT,
    }
  })
  
  module.exports=table;