import express from 'express';
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  bulkDeleteReviews,
  getAnalytics,
  getReviewsByEmployee,
  exportReviews
} from '../controllers/reviewController.js';

const router = express.Router();



// GET /api/reviews 
router.get('/', getAllReviews);

// GET /api/reviews/analytics 
router.get('/analytics', getAnalytics);

// GET /api/reviews/export 
router.get('/export', exportReviews);

// GET /api/reviews/employee/:employeeId 
router.get('/employee/:employeeId', getReviewsByEmployee);

// GET /api/reviews/:id
router.get('/:id', getReviewById);

// POST /api/reviews - Create new review
router.post('/', createReview);

// PUT /api/reviews/:id - Update review
router.put('/:id', updateReview);

// DELETE /api/reviews/:id - Delete single review
router.delete('/:id', deleteReview);

// POST /api/reviews/bulk-delete - Bulk delete reviews
router.post('/bulk-delete', bulkDeleteReviews);

export default router;