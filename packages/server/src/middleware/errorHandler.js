const ERROR_CODES = require('../constants/errorCodes');

// Maps Mongoose validator kinds to API error codes, per field
const MONGOOSE_KIND_CODES = {
  title: {
    required: ERROR_CODES.TITLE_REQUIRED,
    maxlength: ERROR_CODES.TITLE_TOO_LONG,
  },
  description: {
    maxlength: ERROR_CODES.DESCRIPTION_TOO_LONG,
  },
};

/**
 * Global error handling middleware.
 * Catches all errors and returns a consistent JSON response
 * with a translatable `code` and an English fallback `message`.
 */
const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      code: MONGOOSE_KIND_CODES[e.path]?.[e.kind] || ERROR_CODES.VALIDATION_FAILED,
      ...(e.kind === 'maxlength' && { params: { max: e.properties.maxlength } }),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      code: ERROR_CODES.VALIDATION_FAILED,
      message: errors.map((e) => e.message).join('. '),
      errors,
    });
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      code: ERROR_CODES.INVALID_ID,
      message: 'Invalid ID format',
    });
  }

  // Malformed JSON body (from express.json)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      code: ERROR_CODES.INVALID_JSON,
      message: 'Malformed JSON in request body',
    });
  }

  // Default to 500 server error
  res.status(err.statusCode || 500).json({
    success: false,
    code: err.code && ERROR_CODES[err.code] ? err.code : ERROR_CODES.INTERNAL_ERROR,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
