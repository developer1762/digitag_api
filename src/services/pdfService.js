import XLSX from 'xlsx';
import PDFDocument from 'pdfkit';
import getStream from 'get-stream';
import pdfTable from 'pdfkit-table'; // default import since it's CommonJS
import xlsx from 'xlsx';
import PDFDocumentWithTables from 'pdfkit-table'; // ✅ default export is already extended!

const { readFile, utils } = xlsx;


export async function convertExcelToPdf(excelFilePath) {
  const workbook = xlsx.readFile(excelFilePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  if (!jsonData.length) {
    throw new Error('Excel sheet is empty.');
  }

  const doc = new PDFDocumentWithTables({ margin: 30 });
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  const headers = Object.keys(jsonData[0]);
  const rows = jsonData.map(row => headers.map(h => row[h] ?? ''));

  // Render table synchronously
  doc.table(
    {
      title: 'Excel Data as PDF',
      headers,
      rows,
    },
    {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
      prepareRow: () => doc.font('Helvetica').fontSize(9),
    }
  );

  doc.end();

  // Wait for the 'end' event to resolve the full buffer
  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
  });
}



export async function generatePdfFromJson(jsonData) {
  const doc = new PDFDocument({ margin: 30 });
  const buffers = [];

  doc.on('data', buffers.push.bind(buffers));

  // Add the table method to the document prototype
  pdfTable(doc);

  const headers = Object.keys(jsonData[0]);
  const rows = jsonData.map(obj => headers.map(header => obj[header] ?? ''));

  const table = {
    title: "Converted Data",
    headers,
    rows,
  };

  await doc.table(table, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
    prepareRow: (row, i) => doc.font("Helvetica").fontSize(9),
  });

  doc.end();
  const pdfBuffer = await getStream.buffer(doc);
  return pdfBuffer;
}


export async function generatePdfFromJsonOld(jsonData) {
  const doc = new PDFDocument({ margin: 30 });
  let buffers = [];

  doc.on('data', buffers.push.bind(buffers));

  doc.fontSize(16).text('Converted Data', { underline: true });
  doc.moveDown();

  jsonData.forEach((item, idx) => {
    doc.fontSize(8).text(`${idx + 1}.`);
    for (const [key, value] of Object.entries(item)) {
      doc.text(`  ${key}: ${value}`);
    }
    doc.moveDown();
  });

  doc.end();

  const pdfBuffer = await getStream.buffer(doc);
  return pdfBuffer;
}

export async function convertXlsxToPdf(filePath) {
  // 1. Read Excel
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // 2. Create PDF
  const doc = new PDFDocument({ margin: 30 });
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  doc.fontSize(16).text('Excel Data as PDF', { underline: true });
  doc.moveDown();

  jsonData.forEach((row, idx) => {
    doc.fontSize(12).text(`${idx + 1}.`);
    for (const [key, value] of Object.entries(row)) {
      doc.text(`  ${key}: ${value}`);
    }
    doc.moveDown();
  });

  doc.end();
  const pdfBuffer = await getStream.buffer(doc);
  return pdfBuffer;
}

