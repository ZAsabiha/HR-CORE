import { PrismaClient } from '@prisma/client';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();


export const getAllReports = async (req, res) => {
  try {
    const reports = await prisma.reporting.findMany({
      orderBy: {
        generatedDate: 'desc',
      },
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};


export const downloadReportsCSV = async (req, res) => {
  const { reportId } = req.params;  
  try {
   
    const report = await prisma.reporting.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }


    const parser = new Parser();
    const csvData = parser.parse([report]);


    res.header('Content-Type', 'text/csv');
    res.attachment(`report_${reportId}.csv`);
    res.send(csvData);

  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).json({ error: 'Failed to generate CSV' });
  }
};


export const downloadReportsPDF = async (req, res) => {
  const { reportId } = req.params;  
  try {
  
    const report = await prisma.reporting.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }


    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'reports', `report_${reportId}.pdf`);
    doc.pipe(fs.createWriteStream(filePath));


    doc.fontSize(20).text('Report Summary', { align: 'center' });
    doc.text(`Name: ${report.name}`);
    doc.text(`Type: ${report.type}`);
    doc.text(`Date: ${report.generatedDate}`);
    doc.text(`Content: ${report.content}`);
    doc.text('-----------------------');

    doc.end();

    doc.on('finish', () => {
      res.download(filePath, `report_${reportId}.pdf`, (err) => {
        if (err) {
          console.error('Error downloading PDF:', err);
          res.status(500).json({ error: 'Failed to download PDF' });
        }
      });
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};
