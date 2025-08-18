const {DataTypes} = require ('sequelize'); //importação datatypes do sequelize
const sequelize = require ('../config/db') //importar as configuraçoes db, que "entende" meu .env


const Agendamento = sequelize.define('Agendamento',{// Agendamento= nome do modulo e nao da tabela
    id:{type: DataTypes.BIGINT, autoIncrement:true, primaryKey:true},//Bigint= numero inteiro e grande
    usuario_id: {type: DataTypes.BIGINT, allowNull:false},
    inicio: {type: DataTypes.DATE, allowNull:false},// data + hora do inicio
    fim: {type: DataTypes.DATE, allowNull:false},// data+hora do fim
   status:{
    type: DataTypes.ENUM('pendente', 'confirmada', 'cancelada'),//enum= entre oq foi declarado no ()
    allowNull:false,
    defaultValue: 'confirmada'//se nao tiver nenhuma definida, é confirmada
   },
   idempotency_key:{type:DataTypes.STRING(64), allowNull:true, unique:true} //evita duplicação da mesma requisição, cria token
},{
    tableName: 'agendamentos', //nome da tabela
    underscored:true, //cria snake_case
    indexes:[ //indice que facilita busca no bd
        {unique:true, fields:[inicio]} //unico, e pega inico de referencia, para evitar duas pessoas no mesmo horario
    ]
});

module.exports= Agendamento;
  