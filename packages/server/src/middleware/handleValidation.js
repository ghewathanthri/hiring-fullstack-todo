const { validationResult } = require('express-validator');
const ERROR_CODES = require('../constants/errorCodes');

/**
 * Middleware to handle validation errors from express-validator.
 * Returns a 400 response with a translatable error code per field.
 */
const handleValidation = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field: err.path,
      code: err.msg.code,
      ...(err.msg.params && { params: err.msg.params }),
      message: err.msg.message,
    }));

    return res.status(400).json({
      success: false,
      code: ERROR_CODES.VALIDATION_FAILED,
      message: errors.map((e) => e.message).join('. '),
      errors,
    });
  }

  next();
};

module.exports = handleValidation;
