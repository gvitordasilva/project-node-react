const { Video, User, EtapaFormativa, Local } = require('../models');
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

    const videos = await Video.findAll({
      where,
      include: [
        { model: User, as: 'autor', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'pessoa', attributes: ['id', 'nome', 'email'] },
        { model: EtapaFormativa },
        { model: Local }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(videos);
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const getById = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id, {
      include: [
        { model: User, as: 'autor', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'pessoa', attributes: ['id', 'nome', 'email'] },
        { model: EtapaFormativa },
        { model: Local }
      ]
    });

    if (!video) {
      return res.status(404).json({ error: 'Vídeo não encontrado.' });
    }

    res.json(video);
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const create = async (req, res) => {
  try {
    const { titulo, descricao, url, duracao, etapaFormativaId, localId, pessoaId } = req.body;

    const videoData = {
      titulo,
      descricao,
      url: url || null,
      duracao,
      autorId: req.userId,
      etapaFormativaId: etapaFormativaId || null,
      localId: localId || null,
      pessoaId: pessoaId || null
    };

    if (req.file) {
      videoData.arquivo = req.file.filename;
    }

    const video = await Video.create(videoData);

    const videoWithRelations = await Video.findByPk(video.id, {
      include: [
        { model: User, as: 'autor', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'pessoa', attributes: ['id', 'nome', 'email'] },
        { model: EtapaFormativa },
        { model: Local }
      ]
    });

    res.status(201).json(videoWithRelations);
  } catch (error) {
    console.error('Erro ao criar vídeo:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const update = async (req, res) => {
  try {
    const { titulo, descricao, url, duracao, etapaFormativaId, localId, pessoaId } = req.body;

    const video = await Video.findByPk(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Vídeo não encontrado.' });
    }

    const updateData = {
      titulo: titulo || video.titulo,
      descricao: descricao !== undefined ? descricao : video.descricao,
      url: url !== undefined ? url : video.url,
      duracao: duracao !== undefined ? duracao : video.duracao,
      etapaFormativaId: etapaFormativaId !== undefined ? etapaFormativaId : video.etapaFormativaId,
      localId: localId !== undefined ? localId : video.localId,
      pessoaId: pessoaId !== undefined ? pessoaId : video.pessoaId
    };

    if (req.file) {
      // Remove arquivo antigo
      if (video.arquivo) {
        const oldPath = path.join(__dirname, '../../uploads/videos', video.arquivo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updateData.arquivo = req.file.filename;
    }

    await video.update(updateData);

    const videoWithRelations = await Video.findByPk(video.id, {
      include: [
        { model: User, as: 'autor', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'pessoa', attributes: ['id', 'nome', 'email'] },
        { model: EtapaFormativa },
        { model: Local }
      ]
    });

    res.json(videoWithRelations);
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const remove = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Vídeo não encontrado.' });
    }

    await video.update({ ativo: false });
    res.json({ message: 'Vídeo desativado com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover vídeo:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const stream = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video || !video.arquivo) {
      return res.status(404).json({ error: 'Vídeo não encontrado.' });
    }

    const filePath = path.join(__dirname, '../../uploads/videos', video.arquivo);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado.' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error('Erro ao fazer stream:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { getAll, getById, create, update, remove, stream };
