/**
 * Error message and character counter shown under a text field.
 * The counter appears once half the limit is used; at the limit,
 * `limitMessage` is shown unless another error takes precedence.
 */
export default function FieldFeedback({ error, length, max, limitMessage }) {
  const showCount = length >= max / 2;
  const atLimit = length >= max;
  const message = error || (atLimit ? limitMessage : '');

  if (!message && !showCount) return null;

  return (
    <div className="field-feedback">
      {message && <span className="error-message">{message}</span>}
      {showCount && (
        <span className={`char-count ${atLimit ? 'at-limit' : ''}`}>
          {length}/{max}
        </span>
      )}
    </div>
  );
}
