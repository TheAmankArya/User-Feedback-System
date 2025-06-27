const Feedback = require('../models/Feedback');
const { asyncHandler } = require('../middleware/errorHandler');

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

const getAllFeedback = asyncHandler(async (req, res) => {
  const { category, status, sortBy, search, page, limit } = req.query;


  let query = {};

  if (category) {
    query.category = category;
  }

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { userName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { feedbackText: { $regex: search, $options: 'i' } }
    ];
  }

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

  const skip = (page - 1) * limit;

  const [feedback, totalCount, stats] = await Promise.all([
    Feedback.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Feedback.countDocuments(query),
    Feedback.getStats()
  ]);

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

const getFeedbackStats = asyncHandler(async (req, res) => {
  const stats = await Feedback.getStats();

  res.status(200).json({
    success: true,
    data: stats
  });
});

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