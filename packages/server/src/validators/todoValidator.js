const { body, param } = require('express-validator');
const ERROR_CODES = require('../constants/errorCodes');
const { TITLE_MAX, DESCRIPTION_MAX } = require('../constants/todoLimits');

// express-validator messages are { code, params?, message } objects so the
// client can translate them; `message` is the English fallback.
const titleRules = () =>
  body('title')
    .trim()
    .notEmpty()
    .withMessage({
      code: ERROR_CODES.TITLE_REQUIRED,
      message: 'Title is required',
    })
    .isLength({ max: TITLE_MAX })
    .withMessage({
      code: ERROR_CODES.TITLE_TOO_LONG,
      params: { max: TITLE_MAX },
      message: `Title cannot exceed ${TITLE_MAX} characters`,
    });

const descriptionRules = () =>
  body('description')
    .optional()
    .trim()
    .isLength({ max: DESCRIPTION_MAX })
    .withMessage({
      code: ERROR_CODES.DESCRIPTION_TOO_LONG,
      params: { max: DESCRIPTION_MAX },
      message: `Description cannot exceed ${DESCRIPTION_MAX} characters`,
    });

const idRules = () =>
  param('id').trim().notEmpty().withMessage({
    code: ERROR_CODES.INVALID_ID,
    message: 'Invalid TODO ID',
  });

const validateCreateTodo = [titleRules(), descriptionRules()];

const validateUpdateTodo = [idRules(), titleRules(), descriptionRules()];

const validateTodoId = [idRules()];

module.exports = {
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoId,
};
