const { Acompanhamento, User } = require('../models');
const { Op } = require('sequelize');

const getAll = async (req, res) => {
  try {
    const { formandoId, dataInicio, dataFim, search } = req.query;
    const user = req.user;

    const where = { ativo: true };

    // Filtro de segurança: só pode ver acompanhamentos onde é formador ou formando
    if (user.role !== 'admin') {
      where[Op.or] = [
        { formadorId: user.id },
        { formandoId: user.id }
      ];
    }

    if (formandoId) where.formandoId = formandoId;

    if (dataInicio && dataFim) {
      where.dataAcompanhamento = {
        [Op.between]: [dataInicio, dataFim]
      };
    }

    if (search) {
      where[Op.and] = [
        ...(where[Op.and] || []),
        {
          [Op.or]: [
            { titulo: { [Op.like]: `%${search}%` } },
            { conteudo: { [Op.like]: `%${search}%` } }
          ]
        }
      ];
    }

    const acompanhamentos = await Acompanhamento.findAll({
      where,
      include: [
        { model: User, as: 'formador', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'formando', attributes: ['id', 'nome', 'email'] }
      ],
      order: [['dataAcompanhamento', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json(acompanhamentos);
  } catch (error) {
    console.error('Erro ao buscar acompanhamentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const getById = async (req, res) => {
  try {
    const user = req.user;
    const acompanhamento = await Acompanhamento.findByPk(req.params.id, {
      include: [
        { model: User, as: 'formador', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'formando', attributes: ['id', 'nome', 'email'] }
      ]
    });

    if (!acompanhamento) {
      return res.status(404).json({ error: 'Acompanhamento não encontrado.' });
    }

    // Verifica permissão: só pode ver se for admin, formador ou formando do acompanhamento
    if (user.role !== 'admin' &&
        acompanhamento.formadorId !== user.id &&
        acompanhamento.formandoId !== user.id) {
      return res.status(403).json({ error: 'Acesso negado a este acompanhamento.' });
    }

    res.json(acompanhamento);
  } catch (error) {
    console.error('Erro ao buscar acompanhamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const create = async (req, res) => {
  try {
    const { titulo, conteudo, dataAcompanhamento, observacoes, formandoId } = req.body;
    const user = req.user;

    // Verifica se o formando existe
    const formando = await User.findByPk(formandoId);
    if (!formando) {
      return res.status(404).json({ error: 'Formando não encontrado.' });
    }

    // Verifica se o usuário é formador do formando (se não for admin)
    if (user.role !== 'admin' && formando.formadorId !== user.id) {
      return res.status(403).json({ error: 'Você não é formador deste formando.' });
    }

    const acompanhamento = await Acompanhamento.create({
      titulo,
      conteudo,
      dataAcompanhamento: dataAcompanhamento || new Date(),
      observacoes,
      formadorId: user.id,
      formandoId
    });

    const acompanhamentoWithRelations = await Acompanhamento.findByPk(acompanhamento.id, {
      include: [
        { model: User, as: 'formador', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'formando', attributes: ['id', 'nome', 'email'] }
      ]
    });

    res.status(201).json(acompanhamentoWithRelations);
  } catch (error) {
    console.error('Erro ao criar acompanhamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const update = async (req, res) => {
  try {
    const { titulo, conteudo, dataAcompanhamento, observacoes } = req.body;
    const user = req.user;

    const acompanhamento = await Acompanhamento.findByPk(req.params.id);

    if (!acompanhamento) {
      return res.status(404).json({ error: 'Acompanhamento não encontrado.' });
    }

    // Só o formador que criou ou admin pode editar
    if (user.role !== 'admin' && acompanhamento.formadorId !== user.id) {
      return res.status(403).json({ error: 'Apenas o formador que criou pode editar.' });
    }

    await acompanhamento.update({
      titulo: titulo || acompanhamento.titulo,
      conteudo: conteudo || acompanhamento.conteudo,
      dataAcompanhamento: dataAcompanhamento || acompanhamento.dataAcompanhamento,
      observacoes: observacoes !== undefined ? observacoes : acompanhamento.observacoes
    });

    const acompanhamentoWithRelations = await Acompanhamento.findByPk(acompanhamento.id, {
      include: [
        { model: User, as: 'formador', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'formando', attributes: ['id', 'nome', 'email'] }
      ]
    });

    res.json(acompanhamentoWithRelations);
  } catch (error) {
    console.error('Erro ao atualizar acompanhamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const remove = async (req, res) => {
  try {
    const user = req.user;
    const acompanhamento = await Acompanhamento.findByPk(req.params.id);

    if (!acompanhamento) {
      return res.status(404).json({ error: 'Acompanhamento não encontrado.' });
    }

    // Só o formador que criou ou admin pode remover
    if (user.role !== 'admin' && acompanhamento.formadorId !== user.id) {
      return res.status(403).json({ error: 'Apenas o formador que criou pode remover.' });
    }

    await acompanhamento.update({ ativo: false });
    res.json({ message: 'Acompanhamento desativado com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover acompanhamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const getByFormando = async (req, res) => {
  try {
    const user = req.user;
    const formandoId = req.params.formandoId;

    // Verifica permissão
    if (user.role !== 'admin') {
      const formando = await User.findByPk(formandoId);
      if (!formando) {
        return res.status(404).json({ error: 'Formando não encontrado.' });
      }

      // Só pode ver se for o próprio formando ou o formador dele
      if (user.id !== parseInt(formandoId) && formando.formadorId !== user.id) {
        return res.status(403).json({ error: 'Acesso negado.' });
      }
    }

    const acompanhamentos = await Acompanhamento.findAll({
      where: { formandoId, ativo: true },
      include: [
        { model: User, as: 'formador', attributes: ['id', 'nome', 'email'] },
        { model: User, as: 'formando', attributes: ['id', 'nome', 'email'] }
      ],
      order: [['dataAcompanhamento', 'DESC']]
    });

    res.json(acompanhamentos);
  } catch (error) {
    console.error('Erro ao buscar acompanhamentos do formando:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { getAll, getById, create, update, remove, getByFormando };
