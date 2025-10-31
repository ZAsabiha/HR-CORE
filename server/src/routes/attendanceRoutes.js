import express from 'express';
import {
  checkIn,
  checkOut,
  startBreak,
  endBreak,
  getCurrentAttendance,
  getAttendanceLogs
} from '../controllers/attendanceController.js';
import { requireAuth, allowRoles } from '../middleware/auth.js';

const router = express.Router();


router.use(requireAuth);



router.post('/checkin', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), checkIn);
router.post('/checkout', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), checkOut);
router.post('/break/start', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), startBreak);
router.post('/break/end', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), endBreak);


router.get('/current/:employeeId', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), getCurrentAttendance);
router.get('/logs', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), getAttendanceLogs);

export default router;
