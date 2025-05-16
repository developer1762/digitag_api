import express from 'express';
import { convertExceltoPDFFile, convertJSONtoPDFFile } from '../controllers/convertController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/convert/excel/pdf', upload.single('file'), convertExceltoPDFFile);
router.post('/convert/json/pdf', upload.single('file'), convertJSONtoPDFFile);

export default router;
