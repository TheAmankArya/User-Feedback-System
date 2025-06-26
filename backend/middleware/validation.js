const Joi = require('joi');

// Validation schemas
const feedbackSchema = Joi.object({
  userName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'User name is required',
      'string.min': 'User name must be at least 1 character long',
      'string.max': 'User name cannot exceed 100 characters',
      'any.required': 'User name is required'
    }),
  
  email: Joi.string()
    .email()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  
  feedbackText: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Feedback text is required',
      'string.min': 'Feedback text must be at least 10 characters long',
      'string.max': 'Feedback text cannot exceed 1000 characters',
      'any.required': 'Feedback text is required'
    }),
  
  category: Joi.string()
    .valid('suggestion', 'bug-report', 'feature-request', 'general')
    .required()
    .messages({
      'any.only': 'Category must be one of: suggestion, bug-report, feature-request, general',
      'any.required': 'Category is required'
    })
});

const statusUpdateSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'reviewed', 'resolved')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, reviewed, resolved',
      'any.required': 'Status is required'
    })
});

const querySchema = Joi.object({
  category: Joi.string()
    .valid('suggestion', 'bug-report', 'feature-request', 'general')
    .optional(),
  
  status: Joi.string()
    .valid('pending', 'reviewed', 'resolved')
    .optional(),
  
  sortBy: Joi.string()
    .valid('newest', 'oldest', 'category')
    .default('newest'),
  
  search: Joi.string()
    .trim()
    .max(200)
    .optional(),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
});

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false, // Return all validation errors
      stripUnknown: true, // Remove unknown fields
      convert: true // Convert string numbers to numbers
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Update the request with validated and sanitized data
    req[property] = error ? req[property] : schema.validate(req[property]).value;
    next();
  };
};

// Middleware for validating MongoDB ObjectId
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: `${paramName} parameter is required`
      });
    }
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    next();
  };
};

module.exports = {
  validateFeedback: validate(feedbackSchema),
  validateStatusUpdate: validate(statusUpdateSchema),
  validateQuery: validate(querySchema, 'query'),
  validateObjectId
}; 