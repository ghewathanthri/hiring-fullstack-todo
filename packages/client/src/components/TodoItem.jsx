import { useRef, useState } from 'react';
import { Check, GripVertical, Pencil, Trash2, X, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TITLE_MAX, DESCRIPTION_MAX } from '../constants/todoLimits';

export default function TodoItem({
  todo,
  onToggleDone,
  onUpdate,
  onDelete,
  // Set by SortableTodoItem when the item can be reordered
  containerRef,
  containerStyle,
  dragHandleProps,
  isDragging = false,
}) {
  const { t, i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(
    todo.description || ''
  );
  const [errors, setErrors] = useState({});
  const actionsRef = useRef(null);

  // Action buttons fade in on hover; ignore clicks until they are fully visible
  const areActionsVisible = () =>
    actionsRef.current &&
    parseFloat(getComputedStyle(actionsRef.current).opacity) >= 0.99;

  const handleEditClick = () => {
    if (areActionsVisible()) setIsEditing(true);
  };

  const handleDeleteClick = () => {
    if (areActionsVisible()) onDelete(todo.id);
  };

  const validate = () => {
    const newErrors = {};
    if (!editTitle.trim()) {
      newErrors.title = t('validation.titleRequired');
    } else if (editTitle.trim().length > TITLE_MAX) {
      newErrors.title = t('validation.titleMax', { max: TITLE_MAX });
    }
    if (editDescription.length > DESCRIPTION_MAX) {
      newErrors.description = t('validation.descriptionMax', {
        max: DESCRIPTION_MAX,
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const success = await onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
    });

    if (success) {
      setIsEditing(false);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
    setErrors({});
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={`todo-item ${todo.done ? 'done' : ''} ${isEditing ? 'editing' : ''} ${dragHandleProps ? 'sortable' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      {isEditing ? (
        <div className="todo-edit">
          <div className="form-group">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              onKeyDown={handleKeyDown}
              className={`form-input edit-input ${errors.title ? 'input-error' : ''}`}
              placeholder={t('item.titlePlaceholder')}
              autoFocus
            />
            {errors.title && (
              <span className="error-message">{errors.title}</span>
            )}
          </div>
          <div className="form-group">
            <textarea
              value={editDescription}
              onChange={(e) => {
                setEditDescription(e.target.value);
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: '' }));
              }}
              onKeyDown={handleKeyDown}
              className={`form-textarea edit-textarea ${errors.description ? 'input-error' : ''}`}
              placeholder={t('item.descriptionPlaceholder')}
              rows={2}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>
          <div className="edit-actions">
            <button
              className="btn btn-save"
              onClick={handleSave}
              disabled={!editTitle.trim()}
            >
              <Save size={14} />
              {t('item.save')}
            </button>
            <button className="btn btn-cancel" onClick={handleCancel}>
              <X size={14} />
              {t('item.cancel')}
            </button>
          </div>
        </div>
      ) : (
        <>
          {dragHandleProps && (
            <button
              type="button"
              className="drag-handle"
              title={t('item.reorder')}
              aria-label={t('item.reorderAria')}
              {...dragHandleProps}
            >
              <GripVertical size={16} />
            </button>
          )}

          <div className="todo-checkbox-area" onClick={() => onToggleDone(todo.id)}>
            <div className={`todo-checkbox ${todo.done ? 'checked' : ''}`}>
              {todo.done && <Check size={14} strokeWidth={3} />}
            </div>
          </div>

          <div className="todo-content">
            <h3 className={`todo-title ${todo.done ? 'completed' : ''}`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={`todo-description ${todo.done ? 'completed' : ''}`}>
                {todo.description}
              </p>
            )}
            <span className="todo-date">{formatDate(todo.createdAt)}</span>
          </div>

          <div className="todo-actions" ref={actionsRef}>
            <button
              className="btn-icon btn-edit"
              onClick={handleEditClick}
              title={t('item.edit')}
              aria-label={t('item.editAria')}
            >
              <Pencil size={16} />
            </button>
            <button
              className="btn-icon btn-delete"
              onClick={handleDeleteClick}
              title={t('item.delete')}
              aria-label={t('item.deleteAria')}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
