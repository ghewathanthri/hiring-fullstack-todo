/**
 * Turns an API error into a translated message.
 *
 * The server responds with `{ code, params?, message, errors?: [{ field, code, params?, message }] }`.
 * Field-level errors take precedence over the top-level code. Unknown codes,
 * network failures and responses without a code fall back to `fallbackKey`.
 */
export function translateServerError(err, t, fallbackKey) {
  const data = err.response?.data;
  const fieldError = data?.errors?.[0];
  const code = fieldError?.code ?? data?.code;
  const params = fieldError?.params ?? data?.params;

  if (!code) return t(fallbackKey);

  return t(`serverErrors.${code}`, {
    ...params,
    defaultValue: t(fallbackKey),
  });
}
