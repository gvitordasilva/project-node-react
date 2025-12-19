const multer = require('multer');
const path = require('path');

const storageDocuments = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/documents'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const storageVideos = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/videos'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilterDocuments = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|png|jpg|jpeg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname) {
    return cb(null, true);
  }
  cb(new Error('Tipo de arquivo não permitido'));
};

const fileFilterVideos = (req, file, cb) => {
  const allowedTypes = /mp4|avi|mov|wmv|mkv|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  }
  cb(new Error('Tipo de vídeo não permitido'));
};

const uploadDocument = multer({
  storage: storageDocuments,
  fileFilter: fileFilterDocuments,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

const uploadVideo = multer({
  storage: storageVideos,
  fileFilter: fileFilterVideos,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

module.exports = { uploadDocument, uploadVideo };
