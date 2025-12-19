const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middlewares/auth');

router.get('/', auth, userController.getAll);
router.get('/formadores', auth, userController.getFormadores);
router.get('/formandos', auth, userController.getFormandos);
router.get('/:id', auth, userController.getById);

router.post('/', auth, isAdmin, [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
], userController.create);

router.put('/:id', auth, isAdmin, userController.update);
router.delete('/:id', auth, isAdmin, userController.remove);

module.exports = router;
