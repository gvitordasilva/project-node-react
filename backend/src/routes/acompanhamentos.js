const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const acompanhamentoController = require('../controllers/acompanhamentoController');
const { auth, isAdminOrFormador } = require('../middlewares/auth');

router.get('/', auth, acompanhamentoController.getAll);
router.get('/formando/:formandoId', auth, acompanhamentoController.getByFormando);
router.get('/:id', auth, acompanhamentoController.getById);

router.post('/', auth, isAdminOrFormador, [
  body('titulo').notEmpty().withMessage('Título é obrigatório'),
  body('conteudo').notEmpty().withMessage('Conteúdo é obrigatório'),
  body('formandoId').notEmpty().withMessage('Formando é obrigatório')
], acompanhamentoController.create);

router.put('/:id', auth, isAdminOrFormador, acompanhamentoController.update);
router.delete('/:id', auth, isAdminOrFormador, acompanhamentoController.remove);

module.exports = router;
