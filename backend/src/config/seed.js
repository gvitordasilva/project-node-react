require('dotenv').config();
const { sequelize, User, Funcao, Local, EtapaFormativa } = require('../models');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Banco de dados recriado.');

    // Criar Funções
    const funcoes = await Funcao.bulkCreate([
      { nome: 'Coordenador', descricao: 'Coordenador de formação' },
      { nome: 'Formador', descricao: 'Responsável pela formação' },
      { nome: 'Formando', descricao: 'Pessoa em formação' },
      { nome: 'Assistente', descricao: 'Assistente de formação' }
    ]);
    console.log('Funções criadas.');

    // Criar Locais
    const locais = await Local.bulkCreate([
      { nome: 'Sede Principal', endereco: 'Rua Principal, 100', cidade: 'São Paulo', estado: 'SP' },
      { nome: 'Filial Norte', endereco: 'Av. Norte, 200', cidade: 'Manaus', estado: 'AM' },
      { nome: 'Filial Sul', endereco: 'Rua Sul, 300', cidade: 'Porto Alegre', estado: 'RS' },
      { nome: 'Centro de Formação', endereco: 'Av. Central, 400', cidade: 'Brasília', estado: 'DF' }
    ]);
    console.log('Locais criados.');

    // Criar Etapas Formativas
    const etapas = await EtapaFormativa.bulkCreate([
      { nome: 'Etapa Inicial', descricao: 'Primeira etapa da formação', ordem: 1 },
      { nome: 'Etapa Intermediária', descricao: 'Segunda etapa da formação', ordem: 2 },
      { nome: 'Etapa Avançada', descricao: 'Terceira etapa da formação', ordem: 3 },
      { nome: 'Etapa Final', descricao: 'Última etapa da formação', ordem: 4 }
    ]);
    console.log('Etapas formativas criadas.');

    // Criar usuário Admin
    const admin = await User.create({
      nome: 'Administrador',
      email: 'admin@sistema.com',
      senha: 'admin123',
      role: 'admin',
      funcaoId: funcoes[0].id,
      localId: locais[0].id
    });
    console.log('Admin criado.');

    // Criar Formadores
    const formador1 = await User.create({
      nome: 'João Formador',
      email: 'joao@sistema.com',
      senha: 'senha123',
      role: 'formador',
      funcaoId: funcoes[1].id,
      localId: locais[0].id
    });

    const formador2 = await User.create({
      nome: 'Maria Formadora',
      email: 'maria@sistema.com',
      senha: 'senha123',
      role: 'formador',
      funcaoId: funcoes[1].id,
      localId: locais[1].id
    });
    console.log('Formadores criados.');

    // Criar Formandos
    await User.bulkCreate([
      {
        nome: 'Pedro Formando',
        email: 'pedro@sistema.com',
        senha: 'senha123',
        role: 'formando',
        formadorId: formador1.id,
        funcaoId: funcoes[2].id,
        localId: locais[0].id,
        etapaFormativaId: etapas[0].id
      },
      {
        nome: 'Ana Formanda',
        email: 'ana@sistema.com',
        senha: 'senha123',
        role: 'formando',
        formadorId: formador1.id,
        funcaoId: funcoes[2].id,
        localId: locais[0].id,
        etapaFormativaId: etapas[1].id
      },
      {
        nome: 'Carlos Formando',
        email: 'carlos@sistema.com',
        senha: 'senha123',
        role: 'formando',
        formadorId: formador2.id,
        funcaoId: funcoes[2].id,
        localId: locais[1].id,
        etapaFormativaId: etapas[0].id
      }
    ]);
    console.log('Formandos criados.');

    console.log('\n=== SEED CONCLUÍDO ===');
    console.log('\nCredenciais de acesso:');
    console.log('Admin: admin@sistema.com / admin123');
    console.log('Formador 1: joao@sistema.com / senha123');
    console.log('Formador 2: maria@sistema.com / senha123');
    console.log('Formandos: pedro@sistema.com, ana@sistema.com, carlos@sistema.com / senha123');

    process.exit(0);
  } catch (error) {
    console.error('Erro no seed:', error);
    process.exit(1);
  }
};

seed();
