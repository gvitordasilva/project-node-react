const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { auth, isAdminOrFormador } = require('../middlewares/auth');
const { uploadDocument } = require('../middlewares/upload');

router.get('/', auth, documentController.getAll);
router.get('/:id', auth, documentController.getById);
router.get('/:id/download', auth, documentController.download);

router.post('/', auth, isAdminOrFormador, uploadDocument.single('arquivo'), documentController.create);
router.put('/:id', auth, isAdminOrFormador, uploadDocument.single('arquivo'), documentController.update);
router.delete('/:id', auth, isAdminOrFormador, documentController.remove);

module.exports = router;
