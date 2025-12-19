const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { auth, isAdminOrFormador } = require('../middlewares/auth');
const { uploadVideo } = require('../middlewares/upload');

router.get('/', auth, videoController.getAll);
router.get('/:id', auth, videoController.getById);
router.get('/:id/stream', auth, videoController.stream);

router.post('/', auth, isAdminOrFormador, uploadVideo.single('arquivo'), videoController.create);
router.put('/:id', auth, isAdminOrFormador, uploadVideo.single('arquivo'), videoController.update);
router.delete('/:id', auth, isAdminOrFormador, videoController.remove);

module.exports = router;
