const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Usuario = sequelize.define('Usuario', {
    nome: DataTypes.STRING,
    sobrenome: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    senha: DataTypes.STRING,
    data_nascimento: DataTypes.DATE,
    genero: DataTypes.STRING,
    altura: DataTypes.FLOAT,
    peso: DataTypes.FLOAT,
    objetivo: DataTypes.STRING
})

module.exports = Usuario