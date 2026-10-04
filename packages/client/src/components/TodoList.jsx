import { useState } from 'react';
import TodoItem from './TodoItem';
import { ClipboardList, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TodoList({
  todos,
  loading,
  error,
  onToggleDone,
  onUpdate,
  onDelete,
  onRetry,
}) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');

  if (loading) {
    return (
      <div className="state-container">
        <Loader2 className="spinner" size={40} />
        <p className="state-text">{t('list.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container error-state">
        <AlertTriangle size={40} className="state-icon error-icon" />
        <p className="state-text">{error}</p>
        <button className="btn btn-retry" onClick={onRetry}>
          <RefreshCw size={16} />
          {t('list.retry')}
        </button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="state-container empty-state">
        <ClipboardList size={48} className="state-icon empty-icon" />
        <h3 className="state-title">{t('list.emptyTitle')}</h3>
        <p className="state-text">{t('list.emptyText')}</p>
      </div>
    );
  }

  const activeTodos = todos.filter((t) => !t.done);
  const completedTodos = todos.filter((t) => t.done);

  // Clicking the selected badge again returns to the full list
  const toggleFilter = (value) =>
    setFilter((current) => (current === value ? 'all' : value));

  const showActive = filter !== 'completed';
  const showCompleted = filter !== 'active';
  const visibleCount =
    (showActive ? activeTodos.length : 0) +
    (showCompleted ? completedTodos.length : 0);

  const renderItems = (items) =>
    items.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggleDone={onToggleDone}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    ));

  return (
    <div className="todo-list">
      <nav className="list-stats" aria-label={t('list.filterAria')}>
        <div className="stat-filters">
          <button
            type="button"
            className={`stat-badge ${filter === 'active' ? 'selected' : ''}`}
            onClick={() => toggleFilter('active')}
            aria-pressed={filter === 'active'}
          >
            {t('list.active')}
            <span className="stat-count">{activeTodos.length}</span>
          </button>
          <button
            type="button"
            className={`stat-badge ${filter === 'completed' ? 'selected' : ''}`}
            onClick={() => toggleFilter('completed')}
            aria-pressed={filter === 'completed'}
          >
            {t('list.completed')}
            <span className="stat-count">{completedTodos.length}</span>
          </button>
        </div>
        <button
          type="button"
          className={`stat-badge stat-total ${filter === 'all' ? 'selected' : ''}`}
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
        >
          {t('list.total')}
          <span className="stat-count">{todos.length}</span>
        </button>
      </nav>

      {visibleCount === 0 && (
        <p className="state-text filter-empty">
          {filter === 'active' ? t('list.emptyActive') : t('list.emptyCompleted')}
        </p>
      )}

      {showActive && activeTodos.length > 0 && (
        <div className="todo-section">{renderItems(activeTodos)}</div>
      )}

      {showCompleted && completedTodos.length > 0 && (
        <div className="todo-section">
          {filter === 'all' && (
            <h3 className="section-label">{t('list.completedSection')}</h3>
          )}
          {renderItems(completedTodos)}
        </div>
      )}
    </div>
  );
}
