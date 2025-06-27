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

router.get('/stats', getFeedbackStats);
router.put('/bulk-status', bulkUpdateStatus);
router.get('/user/:email', getFeedbackByEmail);
router.post('/', validateFeedback, createFeedback);
router.get('/', validateQuery, getAllFeedback);
router.get('/:id', validateObjectId('id'), getFeedbackById);
router.put('/:id/status', validateObjectId('id'), validateStatusUpdate, updateFeedbackStatus);
router.delete('/:id', validateObjectId('id'), deleteFeedback);

module.exports = router;
