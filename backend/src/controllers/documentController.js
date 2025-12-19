const { Document, User, EtapaFormativa, Local } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

const getAll = async (req, res) => {
  try {
    const { etapaFormativaId, localId, pessoaId, search } = req.query;

    const where = { ativo: true };

    if (etapaFormativaId) where.etapaFormativaId = etapaFormativaId;
    if (localId) where.localId = localId;
    if (pessoaId) where.pessoaId = pessoaId;
    if (search) {
      where[Op.or] = [
        { titulo: { [Op.like]: `%${search}%` } },
        { descricao: { [Op.like]: `%${search}%` } }
      ];
    }

    const documents = await Document.findAll({
      where,
      include: [
        { model: User, as: 'autor', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'pessoa', attributes: ['id', 'nome', 'email'] },
        { model: EtapaFormativa },
        { model: Local }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(documents);
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const getById = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id, {
      include: [
        { model: User, as: 'autor', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'pessoa', attributes: ['id', 'nome', 'email'] },
        { model: EtapaFormativa },
        { model: Local }
      ]
    });

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado.' });
    }

    res.json(document);
  } catch (error) {
    console.error('Erro ao buscar documento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const create = async (req, res) => {
  try {
    const { titulo, descricao, etapaFormativaId, localId, pessoaId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo é obrigatório.' });
    }

    const document = await Document.create({
      titulo,
      descricao,
      arquivo: req.file.filename,
      tipoArquivo: req.file.mimetype,
      tamanho: req.file.size,
      autorId: req.userId,
      etapaFormativaId: etapaFormativaId || null,
      localId: localId || null,
      pessoaId: pessoaId || null
    });

    const documentWithRelations = await Document.findByPk(document.id, {
      include: [
        { model: User, as: 'autor', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'pessoa', attributes: ['id', 'nome', 'email'] },
        { model: EtapaFormativa },
        { model: Local }
      ]
    });

    res.status(201).json(documentWithRelations);
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const update = async (req, res) => {
  try {
    const { titulo, descricao, etapaFormativaId, localId, pessoaId } = req.body;

    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado.' });
    }

    const updateData = {
      titulo: titulo || document.titulo,
      descricao: descricao !== undefined ? descricao : document.descricao,
      etapaFormativaId: etapaFormativaId !== undefined ? etapaFormativaId : document.etapaFormativaId,
      localId: localId !== undefined ? localId : document.localId,
      pessoaId: pessoaId !== undefined ? pessoaId : document.pessoaId
    };

    if (req.file) {
      // Remove arquivo antigo
      const oldPath = path.join(__dirname, '../../uploads/documents', document.arquivo);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      updateData.arquivo = req.file.filename;
      updateData.tipoArquivo = req.file.mimetype;
      updateData.tamanho = req.file.size;
    }

    await document.update(updateData);

    const documentWithRelations = await Document.findByPk(document.id, {
      include: [
        { model: User, as: 'autor', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'pessoa', attributes: ['id', 'nome', 'email'] },
        { model: EtapaFormativa },
        { model: Local }
      ]
    });

    res.json(documentWithRelations);
  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const remove = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado.' });
    }

    await document.update({ ativo: false });
    res.json({ message: 'Documento desativado com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover documento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const download = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado.' });
    }

    const filePath = path.join(__dirname, '../../uploads/documents', document.arquivo);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado.' });
    }

    res.download(filePath, document.titulo + path.extname(document.arquivo));
  } catch (error) {
    console.error('Erro ao fazer download:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { getAll, getById, create, update, remove, download };
