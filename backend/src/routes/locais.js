const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const localController = require('../controllers/localController');
const { auth, isAdmin } = require('../middlewares/auth');

router.get('/', auth, localController.getAll);
router.get('/:id', auth, localController.getById);

router.post('/', auth, isAdmin, [
  body('nome').notEmpty().withMessage('Nome é obrigatório')
], localController.create);

router.put('/:id', auth, isAdmin, localController.update);
router.delete('/:id', auth, isAdmin, localController.remove);

module.exports = router;
