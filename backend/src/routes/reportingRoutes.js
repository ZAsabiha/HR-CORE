import express from 'express';
import { downloadReportsCSV, downloadReportsPDF,getAllReports } from '../controllers/reportingController.js';

const router = express.Router();
router.get('/', getAllReports);

router.get('/:reportId/download/csv', downloadReportsCSV);

router.get('/:reportId/download/pdf', downloadReportsPDF);

export default router;
