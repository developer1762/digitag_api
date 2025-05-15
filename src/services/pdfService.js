import PDFDocument from 'pdfkit';
import getStream from 'get-stream';

export async function generatePdfFromJson(jsonData) {
  const doc = new PDFDocument({ margin: 30 });
  let buffers = [];

  doc.on('data', buffers.push.bind(buffers));

  doc.fontSize(16).text('Converted Data', { underline: true });
  doc.moveDown();

  jsonData.forEach((item, idx) => {
    doc.fontSize(12).text(`${idx + 1}.`);
    for (const [key, value] of Object.entries(item)) {
      doc.text(`  ${key}: ${value}`);
    }
    doc.moveDown();
  });

  doc.end();

  const pdfBuffer = await getStream.buffer(doc);
  return pdfBuffer;
}
