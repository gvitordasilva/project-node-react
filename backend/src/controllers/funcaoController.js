const { Funcao } = require('../models');

const getAll = async (req, res) => {
  try {
    const funcoes = await Funcao.findAll({
      where: { ativo: true },
      order: [['nome', 'ASC']]
    });
    res.json(funcoes);
  } catch (error) {
    console.error('Erro ao buscar funções:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const getById = async (req, res) => {
  try {
    const funcao = await Funcao.findByPk(req.params.id);
    if (!funcao) {
      return res.status(404).json({ error: 'Função não encontrada.' });
    }
    res.json(funcao);
  } catch (error) {
    console.error('Erro ao buscar função:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const create = async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const funcao = await Funcao.create({ nome, descricao });
    res.status(201).json(funcao);
  } catch (error) {
    console.error('Erro ao criar função:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const update = async (req, res) => {
  try {
    const { nome, descricao, ativo } = req.body;
    const funcao = await Funcao.findByPk(req.params.id);

    if (!funcao) {
      return res.status(404).json({ error: 'Função não encontrada.' });
    }

    await funcao.update({ nome, descricao, ativo });
    res.json(funcao);
  } catch (error) {
    console.error('Erro ao atualizar função:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const remove = async (req, res) => {
  try {
    const funcao = await Funcao.findByPk(req.params.id);
    if (!funcao) {
      return res.status(404).json({ error: 'Função não encontrada.' });
    }

    await funcao.update({ ativo: false });
    res.json({ message: 'Função desativada com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover função:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
