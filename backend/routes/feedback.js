const express = require('express');
const router = express.Router();

const {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback,
  getFeedbackStats,
  bulkUpdateStatus,
  getFeedbackByEmail
} = require('../controllers/feedbackController');

const {
  validateFeedback,
  validateStatusUpdate,
  validateQuery,
  validateObjectId
} = require('../middleware/validation');

// Stats route first
router.get('/stats', getFeedbackStats);

// Bulk operations
router.put('/bulk-status', bulkUpdateStatus);

// User feedback by email
router.get('/user/:email', getFeedbackByEmail);

// Main feedback routes
router.post('/', validateFeedback, createFeedback);
router.get('/', validateQuery, getAllFeedback);

// Individual feedback operations  
router.get('/:id', validateObjectId('id'), getFeedbackById);
router.put('/:id/status', validateObjectId('id'), validateStatusUpdate, updateFeedbackStatus);
router.delete('/:id', validateObjectId('id'), deleteFeedback);

module.exports = router; 