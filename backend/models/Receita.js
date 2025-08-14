module.exports = (sequelize, DataTypes) => {
  const Receita = sequelize.define('Receita', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagem: {
      type: DataTypes.STRING,
    },
    ingredientes: {
      type: DataTypes.TEXT,
    },
    preparo: {
      type: DataTypes.TEXT,
    },
    dicas: {
      type: DataTypes.TEXT,
    },
  });

  return Receita;
};
