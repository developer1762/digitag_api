import { parseExcelToJson } from '../services/excelService.js';
import { generatePdfFromJson, convertXlsxToPdf, convertExcelToPdf, convertJsonToPdfRow, convertJsonToPdfCol } from '../services/pdfService.js';
import fs from 'fs/promises';
import path from 'path';
import logger from '../utils/logger.js';

export async function convertExceltoPDFFile(req, res) {
  try {
    logger.info("inside convertExceltoPDFFile...");
    logger.info(req.file.filename);
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const pdfBuffer = await convertExcelToPdf(file.path);

    console.log('PDF Buffer length:', pdfBuffer.length);

    await fs.unlink(file.path); // Delete uploaded file after PDF created

    const { name } = path.parse(file.filename);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${name}_excel_to_pdf.pdf"`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function convertJSONtoPDFFile(req, res) {
  try {
    logger.info("inside convertJSONtoPDFFile...");
    logger.info(req.file.filename);

    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    const jsonContent = await fs.readFile(file.path, 'utf-8');
    let jsonData = JSON.parse(jsonContent);
    if (Array.isArray(jsonData) === false) {
      jsonData = [jsonData];
    }
    const pdfBuffer = await convertJsonToPdfRow(jsonData);

    console.log('PDF Buffer length:', pdfBuffer.length);

    await fs.unlink(file.path); // Delete uploaded file after PDF created

    const { name } = path.parse(file.filename);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${name}.json_to_pdf.pdf"`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function convertExceltoJSONFile(req, res) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    logger.info("inside convertExceltoJSONFile...");
    logger.info(file.filename);
    logger.info(file.path);

    // 1. Parse Excel file to JSON data
    const jsonContent = await parseExcelToJson(file.path);


    // 3. Delete uploaded Excel file
    await fs.unlink(file.path);

    // 4. Set headers and send PDF
    const { name } = path.parse(file.filename);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${name}_excel_to_json.json"`);
    res.send(jsonContent);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
// export async function convertExceltoJSONFile(req, res) {
//   try {
//     const file = req.file;
//     if (!file) return res.status(400).json({ error: 'No file uploaded' });

//     logger.info("inside convertExceltoJSONFile...");
//     logger.info(req.file.filename);
//     logger.info(req.file.path);

//     const jsonContent = await parseExcelToJson(file.path);

    
//     await fs.unlink(file.path); // Delete uploaded file after PDF created

//     const { name } = path.parse(file.filename);

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${name}.pdf"`);
//     res.send(pdfBuffer);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// }
