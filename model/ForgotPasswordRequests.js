const Sequelize=require('sequelize')
const sequelize=require('../utility/database')

const passwordRequests=sequelize.define('passwordRequests',{
    id:{
        type:Sequelize.UUID,
        allowNull:false,
        primaryKey:true
      },
    isActive:{
        type:Sequelize.BOOLEAN,
    }
})

module.exports=passwordRequests;