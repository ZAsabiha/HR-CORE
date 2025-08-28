import express from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
  deleteNotification,
  cleanupOldNotifications
} from '../controllers/notificationController.js';
import { requireAuth, allowRoles } from '../middleware/auth.js';

const router = express.Router();

// All notification endpoints require authentication
router.use(requireAuth);

// GET all notifications for current user
router.get('/', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), getNotifications);

// GET unread notification count
router.get('/unread-count', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), getUnreadCount);

// PUT mark all notifications as read
router.put('/mark-all-read', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), markAllNotificationsAsRead);

// PUT mark specific notification as read
router.put('/:id/read', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), markNotificationAsRead);

// DELETE specific notification
router.delete('/:id', allowRoles('ADMIN', 'TEAM_LEAD', 'EMPLOYEE'), deleteNotification);

// CLEANUP old notifications (admin only)
router.delete('/cleanup/old', allowRoles('ADMIN'), cleanupOldNotifications);

export default router;