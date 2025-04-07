const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const axios = require('axios');
const path = require('path');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticateToken, upload.single('transcript'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.txt' && ext !== '.docx') {
      return res.status(400).json({ error: 'Only .txt or .docx files allowed' });
    }
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 5MB' });
    }

    let transcript;
    if (ext === '.txt') {
      transcript = file.buffer.toString('utf-8');
    } else {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      transcript = result.value;
    }

    const response = await axios.post(process.env.LLM_API_URL, { transcript }, {
      headers: { 'Authorization': `Bearer ${process.env.LLM_API_KEY}` },
    });
    const profile = response.data.profile;

    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Processing failed' });
  }
});

module.exports = router;