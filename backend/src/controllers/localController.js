const { Local } = require('../models');

const getAll = async (req, res) => {
  try {
    const locais = await Local.findAll({
      where: { ativo: true },
      order: [['nome', 'ASC']]
    });
    res.json(locais);
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const getById = async (req, res) => {
  try {
    const local = await Local.findByPk(req.params.id);
    if (!local) {
      return res.status(404).json({ error: 'Local não encontrado.' });
    }
    res.json(local);
  } catch (error) {
    console.error('Erro ao buscar local:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const create = async (req, res) => {
  try {
    const { nome, endereco, cidade, estado } = req.body;
    const local = await Local.create({ nome, endereco, cidade, estado });
    res.status(201).json(local);
  } catch (error) {
    console.error('Erro ao criar local:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const update = async (req, res) => {
  try {
    const { nome, endereco, cidade, estado, ativo } = req.body;
    const local = await Local.findByPk(req.params.id);

    if (!local) {
      return res.status(404).json({ error: 'Local não encontrado.' });
    }

    await local.update({ nome, endereco, cidade, estado, ativo });
    res.json(local);
  } catch (error) {
    console.error('Erro ao atualizar local:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const remove = async (req, res) => {
  try {
    const local = await Local.findByPk(req.params.id);
    if (!local) {
      return res.status(404).json({ error: 'Local não encontrado.' });
    }

    await local.update({ ativo: false });
    res.json({ message: 'Local desativado com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover local:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
