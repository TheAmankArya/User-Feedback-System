const Feedback = require('../models/Feedback');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Public
const createFeedback = asyncHandler(async (req, res) => {
  const { userName, email, feedbackText, category } = req.body;

  const feedback = new Feedback({
    userName,
    email,
    feedbackText,
    category
  });

  const savedFeedback = await feedback.save();

  res.status(201).json({
    success: true,
    message: 'Feedback submitted successfully',
    data: savedFeedback.toResponse()
  });
});

// @desc    Get all feedback with filtering and pagination
// @route   GET /api/feedback
// @access  Public
const getAllFeedback = asyncHandler(async (req, res) => {
  const { category, status, sortBy, search, page, limit } = req.query;

  // Build query
  let query = {};

  // Apply filters
  if (category) {
    query.category = category;
  }

  if (status) {
    query.status = status;
  }

  // Apply search
  if (search) {
    query.$or = [
      { userName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { feedbackText: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort criteria
  let sort = {};
  switch (sortBy) {
    case 'oldest':
      sort = { createdAt: 1 };
      break;
    case 'category':
      sort = { category: 1, createdAt: -1 };
      break;
    case 'newest':
    default:
      sort = { createdAt: -1 };
      break;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute queries in parallel
  const [feedback, totalCount, stats] = await Promise.all([
    Feedback.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Feedback.countDocuments(query),
    Feedback.getStats()
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.status(200).json({
    success: true,
    data: {
      feedback: feedback.map(item => ({
        ...item,
        id: item._id,
        _id: undefined,
        __v: undefined
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      },
      stats
    }
  });
});

// @desc    Get feedback by ID
// @route   GET /api/feedback/:id
// @access  Public
const getFeedbackById = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: 'Feedback not found'
    });
  }

  res.status(200).json({
    success: true,
    data: feedback.toResponse()
  });
});

// @desc    Update feedback status
// @route   PUT /api/feedback/:id/status
// @access  Admin (for now public, can be protected later)
const updateFeedbackStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: 'Feedback not found'
    });
  }

  feedback.status = status;
  await feedback.save();

  res.status(200).json({
    success: true,
    message: 'Feedback status updated successfully',
    data: {
      id: feedback._id,
      status: feedback.status
    }
  });
});

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Admin (for now public, can be protected later)
const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: 'Feedback not found'
    });
  }

  await Feedback.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Feedback deleted successfully'
  });
});

// @desc    Get feedback statistics
// @route   GET /api/feedback/stats
// @access  Public
const getFeedbackStats = asyncHandler(async (req, res) => {
  const stats = await Feedback.getStats();

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Bulk update feedback status
// @route   PUT /api/feedback/bulk-status
// @access  Admin
const bulkUpdateStatus = asyncHandler(async (req, res) => {
  const { ids, status } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an array of feedback IDs'
    });
  }

  if (!['pending', 'reviewed', 'resolved'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be one of: pending, reviewed, resolved'
    });
  }

  const result = await Feedback.updateMany(
    { _id: { $in: ids } },
    { status }
  );

  res.status(200).json({
    success: true,
    message: `Successfully updated ${result.modifiedCount} feedback items`,
    data: {
      matched: result.matchedCount,
      modified: result.modifiedCount
    }
  });
});

// @desc    Get feedback by email
// @route   GET /api/feedback/user/:email
// @access  Public
const getFeedbackByEmail = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const { page = 1, limit = 10 } = req.query;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email parameter is required'
    });
  }

  const skip = (page - 1) * limit;

  const [feedback, totalCount] = await Promise.all([
    Feedback.find({ email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Feedback.countDocuments({ email })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    success: true,
    data: {
      feedback: feedback.map(item => ({
        ...item,
        id: item._id,
        _id: undefined,
        __v: undefined
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit
      }
    }
  });
});

module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback,
  getFeedbackStats,
  bulkUpdateStatus,
  getFeedbackByEmail
}; 