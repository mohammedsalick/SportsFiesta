const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Generate Certificate
router.get('/:participantId', async (req, res) => {
    const { participantId } = req.params;
    // Fetch participant details from DB
    const participant = await User.findById(participantId);
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate_${participant.name}.pdf`);

    doc.text(`Certificate of Participation`, { align: 'center', size: 25 });
    doc.moveDown();
    doc.text(`This is to certify that ${participant.name} has participated in the Corporate Tournament.`, { align: 'center' });
    doc.end();
    doc.pipe(res);
});

module.exports = router;

