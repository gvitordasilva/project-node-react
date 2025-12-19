const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const etapaFormativaController = require('../controllers/etapaFormativaController');
const { auth, isAdmin } = require('../middlewares/auth');

router.get('/', auth, etapaFormativaController.getAll);
router.get('/:id', auth, etapaFormativaController.getById);

router.post('/', auth, isAdmin, [
  body('nome').notEmpty().withMessage('Nome é obrigatório')
], etapaFormativaController.create);

router.put('/:id', auth, isAdmin, etapaFormativaController.update);
router.delete('/:id', auth, isAdmin, etapaFormativaController.remove);

module.exports = router;
