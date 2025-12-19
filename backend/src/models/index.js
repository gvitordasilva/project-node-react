const sequelize = require('../config/database');
const User = require('./User');
const Funcao = require('./Funcao');
const Local = require('./Local');
const EtapaFormativa = require('./EtapaFormativa');
const Document = require('./Document');
const Video = require('./Video');
const Acompanhamento = require('./Acompanhamento');

// Associações de User
User.belongsTo(User, { as: 'formador', foreignKey: 'formadorId' });
User.hasMany(User, { as: 'formandos', foreignKey: 'formadorId' });

User.belongsTo(Funcao, { foreignKey: 'funcaoId' });
Funcao.hasMany(User, { foreignKey: 'funcaoId' });

User.belongsTo(Local, { foreignKey: 'localId' });
Local.hasMany(User, { foreignKey: 'localId' });

User.belongsTo(EtapaFormativa, { foreignKey: 'etapaFormativaId' });
EtapaFormativa.hasMany(User, { foreignKey: 'etapaFormativaId' });

// Associações de Document
Document.belongsTo(User, { as: 'autor', foreignKey: 'autorId' });
User.hasMany(Document, { as: 'documentos', foreignKey: 'autorId' });

Document.belongsTo(EtapaFormativa, { foreignKey: 'etapaFormativaId' });
EtapaFormativa.hasMany(Document, { foreignKey: 'etapaFormativaId' });

Document.belongsTo(Local, { foreignKey: 'localId' });
Local.hasMany(Document, { foreignKey: 'localId' });

Document.belongsTo(User, { as: 'pessoa', foreignKey: 'pessoaId' });

// Associações de Video
Video.belongsTo(User, { as: 'autor', foreignKey: 'autorId' });
User.hasMany(Video, { as: 'videos', foreignKey: 'autorId' });

Video.belongsTo(EtapaFormativa, { foreignKey: 'etapaFormativaId' });
EtapaFormativa.hasMany(Video, { foreignKey: 'etapaFormativaId' });

Video.belongsTo(Local, { foreignKey: 'localId' });
Local.hasMany(Video, { foreignKey: 'localId' });

Video.belongsTo(User, { as: 'pessoa', foreignKey: 'pessoaId' });

// Associações de Acompanhamento
Acompanhamento.belongsTo(User, { as: 'formador', foreignKey: 'formadorId' });
Acompanhamento.belongsTo(User, { as: 'formando', foreignKey: 'formandoId' });
User.hasMany(Acompanhamento, { as: 'acompanhamentosComoFormador', foreignKey: 'formadorId' });
User.hasMany(Acompanhamento, { as: 'acompanhamentosComoFormando', foreignKey: 'formandoId' });

module.exports = {
  sequelize,
  User,
  Funcao,
  Local,
  EtapaFormativa,
  Document,
  Video,
  Acompanhamento
};
