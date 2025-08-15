import express from 'express';
import {
  getReports,
  getReportById,
  downloadReport,
  generateReport
} from '../controllers/reportingController.js';

const router = express.Router();


router.get('/', getReports);

router.get('/:id', getReportById);


router.get('/:id/download/:format', downloadReport);


router.post('/generate', generateReport);

export default router;
