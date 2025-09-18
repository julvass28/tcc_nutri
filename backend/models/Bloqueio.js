const {DataTypes}= require('sequelize');
const sequelize = require('../config/db');

const Bloqueio = sequelize.define('Bloqueio',{
    id:{type:DataTypes.BIGINT, primaryKey:true, autoIncrement:true},
    inicio:{type:DataTypes.DATE, allowNull:false},
    fim:{type:DataTypes.DATE, allowNull:false},
    motivo:{type:DataTypes.STRING(255), allowNull:true},
},{
    tableName:'bloqueio',
    underscored:true,
    indexes: [
        {fields: ['inicio']},
        {fields: ['fim']},
        {fields:['inicio', 'fim']},

    ]

    
});

module.exports=Bloqueio;