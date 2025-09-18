const {DataTypes} = require ('sequelize');
const sequelize = require ('../config/db');


const AgendaConfig = sequelize.define('AgendaConfig',{
    id: {type: DataTypes.BIGINT, autoIncrement:true, primaryKey:true},
    dia_semana: {type: DataTypes.TINYINT,allowNull:false },//segunda,terça...
    inicio: {type: DataTypes.TIME, allowNull:false},//que horas começa a atender, apenas horario
    fim:{ type:DataTypes.TIME, allowNull:false}, //que horas termina de atender
    intervaloMin:{type:DataTypes.INTEGER, allowNull:false, defaultValue:30},//intervalo de consultas, definimos 30 minutos
},{
    tableName:'agenda_config',
    underscored:true
});
module.exports= AgendaConfig;