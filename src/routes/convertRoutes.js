import express from 'express';
import { convertExceltoPDFFile, convertJSONtoPDFFile, convertExceltoJSONFile } from '../controllers/convertController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/convert/excel/pdf', upload.single('file'), convertExceltoPDFFile);
router.post('/convert/json/pdf', upload.single('file'), convertJSONtoPDFFile);
router.post('/convert/excel/json', upload.single('file'), convertExceltoJSONFile);


export default router;
