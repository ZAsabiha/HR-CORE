import express from 'express';
import { 
  getDepartmentsDropdown, 
  getEmployeesByDepartment, 
  updateSalary,
  getCurrentSalary,
  getSalaryById, 
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


router.get('/current', allowRoles('ADMIN'), getCurrentSalary);  
router.get('/:id', allowRoles('ADMIN'), getSalaryById);         
router.put('/', allowRoles('ADMIN'), updateSalary);

// Overtime 
router.get('/overtime/data', allowRoles('ADMIN', 'TEAM_LEAD'), getOvertimeData);
router.get('/overtime/summary', allowRoles('ADMIN', 'TEAM_LEAD'), getOvertimeSummary);

// Payroll generation 
router.post('/payroll/generate', allowRoles('ADMIN'), generatePayrollWithOvertime);

export default router;