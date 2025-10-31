import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { leaveController } from '../controllers/leaveController.js';
import { requireAuth, allowRoles } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Ensure upload directory exists
const uploadDir = 'uploads/leave-documents/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: jpeg, jpg, png, gif, pdf, doc, docx, txt'));
    }
  }
});

// Get all notifications for current employee
router.get('/notifications', requireAuth, async (req, res) => {
  try {
    // Check if user session exists
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: 'User session not found' });
    }

    const notifications = await prisma.notification.findMany({
      where: { employeeId: req.session.user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', requireAuth, async (req, res) => {
  try {
    // Check if user session exists
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: 'User session not found' });
    }

    const notificationId = parseInt(req.params.id);
    
    // Verify the notification belongs to the current user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.employeeId !== req.session.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});


// GET all leave requests (admin/team lead only)
router.get('/', allowRoles('ADMIN', 'TEAM_LEAD'), leaveController.getAllLeaveRequests);

// GET leave requests for specific employee
router.get('/employee/:employeeId', requireAuth, leaveController.getEmployeeLeaveRequests);

// GET current user's leave requests
router.get('/my-requests', requireAuth, async (req, res) => {
  req.params.employeeId = req.session.user.id;
  leaveController.getEmployeeLeaveRequests(req, res);
});

// POST create new leave request
router.post('/', requireAuth, upload.single('handoverDocument'), (req, res) => {
  // Ensure employeeId matches session user (prevent users from submitting for others)
  req.body.employeeId = req.session.user.id;
  leaveController.createLeaveRequest(req, res);
});

// PUT update leave request status (admin/team lead only)
router.put('/:id/status', allowRoles('ADMIN', 'TEAM_LEAD'), leaveController.updateLeaveStatus);

// GET leave request details by ID
router.get('/:id', requireAuth, leaveController.getLeaveRequestById);

// Add this to your leaveRoutes.js

// GET endpoint to serve leave documents securely
// GET endpoint to serve leave documents securely
router.get('/document/:requestId/:filename', requireAuth, async (req, res) => {
  try {
    const { requestId, filename } = req.params;
    const userId = req.session.user.id;
    const userRole = req.session.user.role;
    
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: parseInt(requestId) },
      include: { employee: true }
    });

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    const hasPermission = userRole === 'ADMIN' || 
                         userRole === 'TEAM_LEAD' || 
                         leaveRequest.employeeId === userId;

    if (!hasPermission) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const filePath = path.join(process.cwd(), 'uploads/leave-documents/', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.sendFile(filePath);
    
  } catch (error) {
    console.error('Error serving document:', error);
    res.status(500).json({ error: 'Failed to retrieve document' });
  }
});

// DELETE leave request (admin only or own requests if pending)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    const userRole = req.session.user.role;
    
    // Check if user is admin or the request owner
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: parseInt(id) }
    });

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    // Only allow deletion if:
    // 1. User is admin/team lead, OR
    // 2. User owns the request AND it's still pending
    const canDelete = (userRole === 'ADMIN' || userRole === 'TEAM_LEAD') ||
                     (leaveRequest.employeeId === userId && leaveRequest.status === 'Pending');

    if (!canDelete) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    leaveController.deleteLeaveRequest(req, res);
  } catch (error) {
    console.error('Error in delete route:', error);
    res.status(500).json({ error: 'Failed to process delete request' });
  }
});

// GET leave statistics (admin/team lead only)
router.get('/stats/summary', allowRoles('ADMIN', 'TEAM_LEAD'), leaveController.getLeaveStats);

// GET advanced filtering (admin/team lead only)
router.get('/filter/advanced', allowRoles('ADMIN', 'TEAM_LEAD'), leaveController.getFilteredLeaveRequests);

// GET employee leave balance
router.get('/balance/:employeeId', requireAuth, leaveController.getEmployeeLeaveBalance);

// GET current user's leave balance
router.get('/balance/my-balance/current', requireAuth, async (req, res) => {
  req.params.employeeId = req.session.user.id;
  leaveController.getEmployeeLeaveBalance(req, res);
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: 'File upload error: ' + error.message });
  }
  
  if (error.message && error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message });
  }
  
  next(error);
});

export default router;