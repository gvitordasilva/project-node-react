const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Document = sequelize.define('Document', {
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
  arquivo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipoArquivo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tamanho: {
    type: DataTypes.INTEGER,
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

module.exports = Document;
