import express from 'express';
import { 
  getDepartmentsDropdown, 
  getEmployeesByDepartment, 
  updateSalary,
  getCurrentSalary,
  getSalaryById,  // Add this import
  getOvertimeData,
  getOvertimeSummary,
  generatePayrollWithOvertime 
} from '../controllers/salaryController.js';
import { requireAuth, allowRoles } from '../middleware/auth.js';

const router = express.Router();

// All salary endpoints require authentication
router.use(requireAuth);

// Dropdowns
router.get('/dropdown/departments', allowRoles('ADMIN'), getDepartmentsDropdown);
router.get('/dropdown/employees', allowRoles('ADMIN'), getEmployeesByDepartment);

// Salary management (Admin-only)
router.get('/current', allowRoles('ADMIN'), getCurrentSalary);  // Get latest salary by employee ID
router.get('/:id', allowRoles('ADMIN'), getSalaryById);         // Get specific salary by salary ID
router.put('/', allowRoles('ADMIN'), updateSalary);

// Overtime (Admin + Team Leads can view)
router.get('/overtime/data', allowRoles('ADMIN', 'TEAM_LEAD'), getOvertimeData);
router.get('/overtime/summary', allowRoles('ADMIN', 'TEAM_LEAD'), getOvertimeSummary);

// Payroll generation (Admin-only)
router.post('/payroll/generate', allowRoles('ADMIN'), generatePayrollWithOvertime);

export default router;
