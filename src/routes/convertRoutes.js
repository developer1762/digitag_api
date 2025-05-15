import express from 'express';
import { convertFile } from '../controllers/convertController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/convert', upload.single('file'), convertFile);

export default router;
