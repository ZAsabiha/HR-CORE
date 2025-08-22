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

// All attendance endpoints require authentication
router.use(requireAuth);

// Attendance tracking actions - all roles can track their own attendance
router.post('/checkin', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), checkIn);
router.post('/checkout', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), checkOut);
router.post('/break/start', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), startBreak);
router.post('/break/end', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), endBreak);

// Get attendance data - all roles can view
router.get('/current/:employeeId', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), getCurrentAttendance);
router.get('/logs', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), getAttendanceLogs);

export default router;
