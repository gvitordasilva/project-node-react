const { EtapaFormativa } = require('../models');

const getAll = async (req, res) => {
  try {
    const etapas = await EtapaFormativa.findAll({
      where: { ativo: true },
      order: [['ordem', 'ASC'], ['nome', 'ASC']]
    });
    res.json(etapas);
  } catch (error) {
    console.error('Erro ao buscar etapas formativas:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const getById = async (req, res) => {
  try {
    const etapa = await EtapaFormativa.findByPk(req.params.id);
    if (!etapa) {
      return res.status(404).json({ error: 'Etapa formativa não encontrada.' });
    }
    res.json(etapa);
  } catch (error) {
    console.error('Erro ao buscar etapa formativa:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const create = async (req, res) => {
  try {
    const { nome, descricao, ordem } = req.body;
    const etapa = await EtapaFormativa.create({ nome, descricao, ordem });
    res.status(201).json(etapa);
  } catch (error) {
    console.error('Erro ao criar etapa formativa:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const update = async (req, res) => {
  try {
    const { nome, descricao, ordem, ativo } = req.body;
    const etapa = await EtapaFormativa.findByPk(req.params.id);

    if (!etapa) {
      return res.status(404).json({ error: 'Etapa formativa não encontrada.' });
    }

    await etapa.update({ nome, descricao, ordem, ativo });
    res.json(etapa);
  } catch (error) {
    console.error('Erro ao atualizar etapa formativa:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const remove = async (req, res) => {
  try {
    const etapa = await EtapaFormativa.findByPk(req.params.id);
    if (!etapa) {
      return res.status(404).json({ error: 'Etapa formativa não encontrada.' });
    }

    await etapa.update({ ativo: false });
    res.json({ message: 'Etapa formativa desativada com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover etapa formativa:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
