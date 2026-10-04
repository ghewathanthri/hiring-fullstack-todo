import { useState, useEffect, useCallback } from 'react';
import { todoApi } from '../services/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { translateServerError } from '../i18n/serverError';

export function useTodos() {
  const { t } = useTranslation();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoApi.getAll();
      setTodos(response.data);
    } catch (err) {
      const message = translateServerError(err, t, 'errors.load');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (data) => {
    try {
      const response = await todoApi.create(data);
      setTodos((prev) => [response.data, ...prev]);
      toast.success(t('toast.created'));
      return true;
    } catch (err) {
      const message = translateServerError(err, t, 'errors.create');
      toast.error(message);
      return false;
    }
  };

  const updateTodo = async (id, data) => {
    // Optimistic update
    const previousTodos = [...todos];
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...data } : todo))
    );

    try {
      const response = await todoApi.update(id, data);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? response.data : todo))
      );
      toast.success(t('toast.updated'));
      return true;
    } catch (err) {
      // Rollback on error
      setTodos(previousTodos);
      const message = translateServerError(err, t, 'errors.update');
      toast.error(message);
      return false;
    }
  };

  const toggleDone = async (id) => {
    // Optimistic update
    const previousTodos = [...todos];
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );

    try {
      const response = await todoApi.toggleDone(id);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? response.data : todo))
      );
    } catch (err) {
      // Rollback on error
      setTodos(previousTodos);
      const message = translateServerError(err, t, 'errors.toggle');
      toast.error(message);
    }
  };

  const deleteTodo = async (id) => {
    // Optimistic update
    const previousTodos = [...todos];
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    try {
      await todoApi.delete(id);
      toast.success(t('toast.deleted'));
    } catch (err) {
      // Rollback on error
      setTodos(previousTodos);
      const message = translateServerError(err, t, 'errors.delete');
      toast.error(message);
    }
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    toggleDone,
    deleteTodo,
    refetch: fetchTodos,
  };
}
