const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').notEmpty().withMessage('Senha é obrigatória')
], authController.login);

router.get('/me', auth, authController.me);

router.put('/change-password', auth, [
  body('senhaAtual').notEmpty().withMessage('Senha atual é obrigatória'),
  body('novaSenha').isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres')
], authController.changePassword);

module.exports = router;
