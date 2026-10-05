/**
 * Stable error codes returned by the API in the `code` field.
 * Clients translate these; the `message` field is an English fallback only.
 * Keep in sync with `serverErrors` in the client translation files.
 */
const ERROR_CODES = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  TITLE_REQUIRED: 'TITLE_REQUIRED',
  TITLE_TOO_LONG: 'TITLE_TOO_LONG',
  DESCRIPTION_TOO_LONG: 'DESCRIPTION_TOO_LONG',
  INVALID_ID: 'INVALID_ID',
  INVALID_ORDER: 'INVALID_ORDER',
  INVALID_JSON: 'INVALID_JSON',
  TODO_NOT_FOUND: 'TODO_NOT_FOUND',
  ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

module.exports = ERROR_CODES;
