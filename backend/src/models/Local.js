const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Local = sequelize.define('Local', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Local;
