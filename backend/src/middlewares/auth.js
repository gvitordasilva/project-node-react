const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.ativo) {
      return res.status(401).json({ error: 'Usuário não encontrado ou inativo.' });
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido.' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

const isFormador = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'formador') {
    return res.status(403).json({ error: 'Acesso negado. Apenas formadores.' });
  }
  next();
};

const isAdminOrFormador = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'formador') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores ou formadores.' });
  }
  next();
};

module.exports = { auth, isAdmin, isFormador, isAdminOrFormador };
