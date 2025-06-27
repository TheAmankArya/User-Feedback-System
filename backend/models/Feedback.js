const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
    minlength: [1, 'User name must be at least 1 character long'],
    maxlength: [100, 'User name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  feedbackText: {
    type: String,
    required: [true, 'Feedback text is required'],
    trim: true,
    minlength: [10, 'Feedback text must be at least 10 characters long'],
    maxlength: [1000, 'Feedback text cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['suggestion', 'bug-report', 'feature-request', 'general'],
      message: 'Category must be one of: suggestion, bug-report, feature-request, general'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'reviewed', 'resolved'],
      message: 'Status must be one of: pending, reviewed, resolved'
    },
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

feedbackSchema.index({ category: 1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ timestamp: -1 });
feedbackSchema.index({ email: 1 });
feedbackSchema.index({ createdAt: -1 });

feedbackSchema.index({
  userName: 'text',
  email: 'text',
  feedbackText: 'text'
});

feedbackSchema.methods.toResponse = function() {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

feedbackSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        byCategory: {
          $push: {
            category: '$category',
            count: 1
          }
        },
        byStatus: {
          $push: {
            status: '$status',
            count: 1
          }
        }
      }
    }
  ]);

  const categoryStats = await this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  const statusStats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentActivity = await Promise.all([
    this.countDocuments({ createdAt: { $gte: today } }),
    this.countDocuments({ createdAt: { $gte: weekAgo } }),
    this.countDocuments({ createdAt: { $gte: monthAgo } })
  ]);

  return {
    total: stats[0]?.total || 0,
    byCategory: categoryStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {
      suggestion: 0,
      'bug-report': 0,
      'feature-request': 0,
      general: 0
    }),
    byStatus: statusStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {
      pending: 0,
      reviewed: 0,
      resolved: 0
    }),
    recentActivity: {
      today: recentActivity[0],
      thisWeek: recentActivity[1],
      thisMonth: recentActivity[2]
    }
  };
};

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;