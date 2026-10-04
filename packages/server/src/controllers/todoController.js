const todoStore = require('../services/todoStore');
const ERROR_CODES = require('../constants/errorCodes');

/**
 * @desc    Get all TODOs
 * @route   GET /api/todos
 */
const getTodos = async (req, res, next) => {
  try {
    const todos = await todoStore.find();
    res.json({ success: true, data: todos });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new TODO
 * @route   POST /api/todos
 */
const createTodo = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const todo = await todoStore.create({
      title,
      description: description || '',
    });

    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a TODO (title/description)
 * @route   PUT /api/todos/:id
 */
const updateTodo = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const todo = await todoStore.findByIdAndUpdate(req.params.id, {
      title,
      description,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        code: ERROR_CODES.TODO_NOT_FOUND,
        message: 'TODO not found',
      });
    }

    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle done status
 * @route   PATCH /api/todos/:id/done
 */
const toggleDone = async (req, res, next) => {
  try {
    const todo = await todoStore.toggleDone(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        code: ERROR_CODES.TODO_NOT_FOUND,
        message: 'TODO not found',
      });
    }

    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a TODO
 * @route   DELETE /api/todos/:id
 */
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await todoStore.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        code: ERROR_CODES.TODO_NOT_FOUND,
        message: 'TODO not found',
      });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  toggleDone,
  deleteTodo,
};
