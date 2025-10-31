import express from 'express';
import { 
  getAllReports, 
  getReportStats, 
  generateReport, 
  downloadReport, 
  deleteReport 
} from '../controllers/reportingController.js';
import { requireAuth, allowRoles } from '../middleware/auth.js';
const router = express.Router();

router.get('/', requireAuth, allowRoles('ADMIN'), getAllReports);
router.get('/stats', requireAuth, allowRoles('ADMIN'), getReportStats);
router.post('/generate', requireAuth, allowRoles('ADMIN'), generateReport);
router.get('/:id/download', requireAuth, allowRoles('ADMIN'), downloadReport);
router.delete('/:id', requireAuth, allowRoles('ADMIN'), deleteReport);

export default router;
