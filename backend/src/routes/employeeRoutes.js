import express from 'express';
import {
  getEmployees, getEmployeeById, searchEmployees,
  createEmployee, updateEmployee, deleteEmployee
} from '../controllers/employeeController.js';
import { requireAuth, allowRoles } from '../middleware/auth.js';

const router = express.Router();

// All employee endpoints require login
router.use(requireAuth);

// VIEW + SEARCH: admin, teamlead, employee
router.get('/',        allowRoles('ADMIN','TEAM_LEAD','EMPLOYEE'), getEmployees);
router.get('/search',  allowRoles('ADMIN','TEAM_LEAD','EMPLOYEE'), searchEmployees);
router.get('/:id',     allowRoles('ADMIN','TEAM_LEAD','EMPLOYEE'), getEmployeeById);

// CREATE/UPDATE/DELETE: admin only
router.post('/',       allowRoles('ADMIN'), createEmployee);
router.put('/:id',     allowRoles('ADMIN'), updateEmployee);
router.delete('/:id',  allowRoles('ADMIN'), deleteEmployee);

export default router;

