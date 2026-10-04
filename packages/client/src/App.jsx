import { Toaster } from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { useTodos } from './hooks/useTodos';
import './App.css';

function App() {
  const { t } = useTranslation();
  const {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    toggleDone,
    reorderTodos,
    deleteTodo,
    refetch,
  } = useTodos();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e1e2e',
            color: '#cdd6f4',
            border: '1px solid rgba(137, 180, 250, 0.2)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#a6e3a1', secondary: '#1e1e2e' },
          },
          error: {
            iconTheme: { primary: '#f38ba8', secondary: '#1e1e2e' },
          },
        }}
      />

      <div className="app">
        <div className="background-effects">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="container">
          <header className="app-header">
            <div className="logo">
              <CheckCircle2 size={32} className="logo-icon" />
              <h1 className="app-title">{t('app.title')}</h1>
            </div>
            <p className="app-subtitle">{t('app.subtitle')}</p>
          </header>

          <main className="app-main">
            <TodoForm onSubmit={addTodo} />
            <TodoList
              todos={todos}
              loading={loading}
              error={error}
              onToggleDone={toggleDone}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              onReorder={reorderTodos}
              onRetry={refetch}
            />
          </main>

          <footer className="app-footer">
            <p>{t('app.footer')}</p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
