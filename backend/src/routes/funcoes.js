const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const funcaoController = require('../controllers/funcaoController');
const { auth, isAdmin } = require('../middlewares/auth');

router.get('/', auth, funcaoController.getAll);
router.get('/:id', auth, funcaoController.getById);

router.post('/', auth, isAdmin, [
  body('nome').notEmpty().withMessage('Nome é obrigatório')
], funcaoController.create);

router.put('/:id', auth, isAdmin, funcaoController.update);
router.delete('/:id', auth, isAdmin, funcaoController.remove);

module.exports = router;
