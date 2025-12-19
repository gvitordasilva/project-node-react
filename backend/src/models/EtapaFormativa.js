const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EtapaFormativa = sequelize.define('EtapaFormativa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ordem: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = EtapaFormativa;
