import express from 'express';
import {
  getDepartmentsDropdown,
  getEmployeesByDepartment,
  updateSalary,
  getOvertimeData,
  getOvertimeSummary,
  generatePayrollWithOvertime
} from '../controllers/salaryController.js';
import { requireAuth, allowRoles } from '../middleware/auth.js';

const router = express.Router();

// All salary endpoints require authentication
router.use(requireAuth);

// Existing routes
router.get('/dropdown/departments', allowRoles('ADMIN', 'TEAM_LEAD'), getDepartmentsDropdown);
router.get('/dropdown/employees', allowRoles('ADMIN', 'TEAM_LEAD'), getEmployeesByDepartment);
router.put('/', allowRoles('ADMIN'), updateSalary);

// NEW: Overtime-related routes
router.get('/overtime/data', allowRoles('ADMIN', 'TEAM_LEAD'), getOvertimeData);
router.get('/overtime/summary', allowRoles('ADMIN', 'TEAM_LEAD'), getOvertimeSummary);
router.post('/payroll/generate', allowRoles('ADMIN'), generatePayrollWithOvertime);

export default router;
