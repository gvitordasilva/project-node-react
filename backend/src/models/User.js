const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'formador', 'formando'),
    defaultValue: 'formando'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  formadorId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  funcaoId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  localId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  etapaFormativaId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.senha) {
        user.senha = await bcrypt.hash(user.senha, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('senha')) {
        user.senha = await bcrypt.hash(user.senha, 10);
      }
    }
  }
});

User.prototype.validarSenha = async function(senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = User;
