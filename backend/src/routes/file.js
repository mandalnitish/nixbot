// backend/src/routes/file.js
const express = require('express');
const router = express.Router();
const { upload, uploadFile } = require('../controllers/fileController');
const { protect } = require('../middleware/auth');

router.post(
  '/upload',
  protect,
  upload.single('file'),
  uploadFile
);

module.exports = router;