const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Funcao = sequelize.define('Funcao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Funcao;
