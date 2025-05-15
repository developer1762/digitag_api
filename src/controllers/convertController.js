import { parseExcelToJson } from '../services/excelService.js';
import { generatePdfFromJson } from '../services/pdfService.js';
import fs from 'fs/promises';

export async function convertFile(req, res) {
  try {
    console.log(req.file);
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    // Convert Excel to JSON
    const jsonData = await parseExcelToJson(file.path);

    // Convert JSON to PDF buffer
    const pdfBuffer = await generatePdfFromJson(jsonData);

    // Cleanup uploaded file after processing
    await fs.unlink(file.path);

    // Return PDF as response
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=output.pdf',
    });
    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
export async function convertFileToJson(req, res) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    // Convert Excel to JSON
    const jsonData = await parseExcelToJson(file.path);

    // Cleanup uploaded file after processing
    await fs.unlink(file.path);

    // Return JSON as response
    res.json(jsonData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}