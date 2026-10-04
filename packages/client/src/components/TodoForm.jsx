import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TITLE_MAX, DESCRIPTION_MAX } from '../constants/todoLimits';

export default function TodoForm({ onSubmit }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = t('validation.titleRequired');
    } else if (title.trim().length > TITLE_MAX) {
      newErrors.title = t('validation.titleMax', { max: TITLE_MAX });
    }
    if (description.length > DESCRIPTION_MAX) {
      newErrors.description = t('validation.descriptionMax', {
        max: DESCRIPTION_MAX,
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const success = await onSubmit({
      title: title.trim(),
      description: description.trim(),
    });

    if (success) {
      setTitle('');
      setDescription('');
      setIsExpanded(false);
      setErrors({});
    }
    setSubmitting(false);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2 className="form-title">{t('form.heading')}</h2>
      </div>

      <div className="form-body">
        <div className="form-group">
          <div className="input-wrapper">
            <input
              id="todo-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              onFocus={() => setIsExpanded(true)}
              placeholder={t('form.titlePlaceholder')}
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              disabled={submitting}
              autoComplete="off"
            />
          </div>
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>

        <div className={`description-area ${isExpanded ? 'expanded' : ''}`}>
          <div className="form-group">
            <textarea
              id="todo-description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder={t('form.descriptionPlaceholder')}
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
              rows={3}
              disabled={submitting}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !title.trim()}
        >
          <Plus size={18} />
          {submitting ? t('form.submitting') : t('form.submit')}
        </button>
      </div>
    </form>
  );
}
