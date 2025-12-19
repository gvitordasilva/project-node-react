const { User, Funcao, Local, EtapaFormativa } = require('../models');
const { Op } = require('sequelize');

const getAll = async (req, res) => {
  try {
    const { role, localId, etapaFormativaId, funcaoId, formadorId, search } = req.query;

    const where = { ativo: true };

    if (role) where.role = role;
    if (localId) where.localId = localId;
    if (etapaFormativaId) where.etapaFormativaId = etapaFormativaId;
    if (funcaoId) where.funcaoId = funcaoId;
    if (formadorId) where.formadorId = formadorId;
    if (search) {
      where[Op.or] = [
        { nome: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ['senha'] },
      include: [
        { model: Funcao },
        { model: Local },
        { model: EtapaFormativa },
        { model: User, as: 'formador', attributes: ['id', 'nome', 'email'] }
      ],
      order: [['nome', 'ASC']]
    });

    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const getById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['senha'] },
      include: [
        { model: Funcao },
        { model: Local },
        { model: EtapaFormativa },
        { model: User, as: 'formador', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'formandos', attributes: ['id', 'nome', 'email'] }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const create = async (req, res) => {
  try {
    const { nome, email, senha, role, formadorId, funcaoId, localId, etapaFormativaId } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    const user = await User.create({
      nome,
      email,
      senha,
      role: role || 'formando',
      formadorId,
      funcaoId,
      localId,
      etapaFormativaId
    });

    const userWithRelations = await User.findByPk(user.id, {
      attributes: { exclude: ['senha'] },
      include: [
        { model: Funcao },
        { model: Local },
        { model: EtapaFormativa },
        { model: User, as: 'formador', attributes: ['id', 'nome', 'email'] }
      ]
    });

    res.status(201).json(userWithRelations);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const update = async (req, res) => {
  try {
    const { nome, email, role, formadorId, funcaoId, localId, etapaFormativaId, ativo } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado.' });
      }
    }

    await user.update({
      nome: nome || user.nome,
      email: email || user.email,
      role: role || user.role,
      formadorId: formadorId !== undefined ? formadorId : user.formadorId,
      funcaoId: funcaoId !== undefined ? funcaoId : user.funcaoId,
      localId: localId !== undefined ? localId : user.localId,
      etapaFormativaId: etapaFormativaId !== undefined ? etapaFormativaId : user.etapaFormativaId,
      ativo: ativo !== undefined ? ativo : user.ativo
    });

    const userWithRelations = await User.findByPk(user.id, {
      attributes: { exclude: ['senha'] },
      include: [
        { model: Funcao },
        { model: Local },
        { model: EtapaFormativa },
        { model: User, as: 'formador', attributes: ['id', 'nome', 'email'] }
      ]
    });

    res.json(userWithRelations);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const remove = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    await user.update({ ativo: false });
    res.json({ message: 'Usuário desativado com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const getFormadores = async (req, res) => {
  try {
    const formadores = await User.findAll({
      where: {
        role: { [Op.in]: ['admin', 'formador'] },
        ativo: true
      },
      attributes: ['id', 'nome', 'email'],
      order: [['nome', 'ASC']]
    });

    res.json(formadores);
  } catch (error) {
    console.error('Erro ao buscar formadores:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const getFormandos = async (req, res) => {
  try {
    const where = { ativo: true };

    // Se for formador, só pode ver seus formandos
    if (req.user.role === 'formador') {
      where.formadorId = req.user.id;
    }

    const formandos = await User.findAll({
      where,
      attributes: { exclude: ['senha'] },
      include: [
        { model: Funcao },
        { model: Local },
        { model: EtapaFormativa },
        { model: User, as: 'formador', attributes: ['id', 'nome', 'email'] }
      ],
      order: [['nome', 'ASC']]
    });

    res.json(formandos);
  } catch (error) {
    console.error('Erro ao buscar formandos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { getAll, getById, create, update, remove, getFormadores, getFormandos };
