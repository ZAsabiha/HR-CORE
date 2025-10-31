
import express from 'express';
import {
  getEmployeeGoals,
  createGoal,
  updateGoal,
  updateGoalStatus,
  deleteGoal,
  bulkAction
} from '../controllers/goalController.js';
import { requireAuth, allowRoles } from '../middleware/auth.js';

const router = express.Router();


router.use(requireAuth);

// VIEW: 

router.get('/', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), getEmployeeGoals);

// CREATE:
router.post('/', allowRoles('ADMIN', 'TEAM_LEAD'), createGoal);

// UPDATE STATUS/PROGRESS

router.put('/:id/update-status', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), updateGoalStatus);

// BULK ACTIONS: 
router.put('/bulk', allowRoles('ADMIN', 'TEAM_LEAD'), bulkAction);

// UPDATE GOAL 
router.put('/:id', allowRoles('ADMIN', 'TEAM_LEAD'), updateGoal);

// DELETE: admin and teamlead only
router.delete('/:id', allowRoles('ADMIN', 'TEAM_LEAD'), deleteGoal);

export default router;