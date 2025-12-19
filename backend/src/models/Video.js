const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  arquivo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duracao: {
    type: DataTypes.STRING,
    allowNull: true
  },
  autorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  etapaFormativaId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  localId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  pessoaId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Video;
