import express from 'express';
import { login, logout, status } from '../controllers/authController.js';
import { requireAuth, allowRoles } from '../middleware/auth.js'; 

const router = express.Router();


router.post('/login', login);


router.post('/logout', requireAuth, logout); 
router.get('/status', requireAuth, status); 


router.get('/admin-only', requireAuth, allowRoles('ADMIN'), (req, res) => {
  res.json({ message: `Hello ${req.session.user.name}, you are an ADMIN.` });
});

export default router;

