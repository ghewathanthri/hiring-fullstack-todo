/**
 * Field length limits for TODOs, shared by the Mongoose model and the
 * request validators. Keep in sync with client/src/constants/todoLimits.js.
 */
const TODO_LIMITS = {
  TITLE_MAX: 200,
  DESCRIPTION_MAX: 1000,
};

module.exports = TODO_LIMITS;
