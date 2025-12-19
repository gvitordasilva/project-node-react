const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Acompanhamento = sequelize.define('Acompanhamento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dataAcompanhamento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  formadorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  formandoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Acompanhamento;
