const express = require('express');
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  toggleDone,
  reorderTodos,
  deleteTodo,
} = require('../controllers/todoController');
const {
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoId,
  validateReorderTodos,
} = require('../validators/todoValidator');
const handleValidation = require('../middleware/handleValidation');

// GET /api/todos - Get all TODOs
router.get('/', getTodos);

// POST /api/todos - Create a new TODO
router.post('/', validateCreateTodo, handleValidation, createTodo);

// PUT /api/todos/reorder - Reorder TODOs (registered before /:id)
router.put('/reorder', validateReorderTodos, handleValidation, reorderTodos);

// PUT /api/todos/:id - Update a TODO (title/description)
router.put('/:id', validateUpdateTodo, handleValidation, updateTodo);

// PATCH /api/todos/:id/done - Toggle done status
router.patch('/:id/done', validateTodoId, handleValidation, toggleDone);

// DELETE /api/todos/:id - Delete a TODO
router.delete('/:id', validateTodoId, handleValidation, deleteTodo);

module.exports = router;
