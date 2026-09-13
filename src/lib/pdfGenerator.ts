import PDFDocument from 'pdfkit';

export const generateQuotationPDF = async (details: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Build PDF Content
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#0f172a').text('Bros WebStudio', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(14).font('Helvetica').fillColor('#64748b').text('Official Project Estimate', { align: 'center' });
      doc.moveDown(2);
      
      doc.rect(50, doc.y, 500, 1).fill('#e2e8f0');
      doc.moveDown();

      doc.fontSize(12).font('Helvetica-Bold').fillColor('#0f172a').text('Client Details:');
      doc.font('Helvetica').fillColor('#334155');
      doc.text(`Name: ${details.contactName || 'N/A'}`);
      doc.text(`Email: ${details.contactEmail || 'N/A'}`);
      if (details.contactPhone) doc.text(`Phone: ${details.contactPhone}`);
      doc.moveDown(1.5);

      const parsed = details.servicesSelected || {};
      const { category, projectName, target, techStack, deadline, features } = parsed;
      
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#0f172a').text('Project Scope:');
      doc.font('Helvetica').fillColor('#334155');
      
      doc.text(`Category: ${category ? category.toUpperCase() : 'N/A'}`);
      if (projectName) doc.text(`Project Title: ${projectName}`);
      if (target) doc.text(`Target Audience: ${target}`);
      if (techStack) doc.text(`Tech Stack: ${techStack}`);
      if (deadline) doc.text(`Deadline: ${deadline}`);
      doc.moveDown();

      if (features && Array.isArray(features) && features.length > 0) {
        doc.font('Helvetica-Bold').text('Selected Add-ons:');
        doc.font('Helvetica');
        features.forEach(f => {
          doc.text(`• ${f.replace(/_/g, ' ')}`, { indent: 15 });
        });
        doc.moveDown();
      }

      doc.rect(50, doc.y, 500, 1).fill('#e2e8f0');
      doc.moveDown();

      doc.fontSize(16).font('Helvetica-Bold').fillColor('#0f172a').text(`Estimated Investment: Rs. ${details.totalEstimate ? details.totalEstimate.toLocaleString('en-IN') : 0}`);
      
      if (details.message) {
        doc.moveDown();
        doc.fontSize(12).font('Helvetica-Bold').text('Additional Notes:');
        doc.font('Helvetica').text(details.message);
      }

      doc.moveDown(3);
      doc.fontSize(10).fillColor('#94a3b8').text('This is an automatically generated estimate based on your selections. Final pricing may vary after our scoping call. No hidden charges.', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
