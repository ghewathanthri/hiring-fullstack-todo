const Todo = require('../models/Todo');

const todoStore = {
  async find() {
    return await Todo.find().sort({ createdAt: -1 });
  },

  async create({ title, description }) {
    return await Todo.create({ title, description });
  },

  async findByIdAndUpdate(id, { title, description }) {
    return await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    );
  },

  async toggleDone(id) {
    const todo = await Todo.findById(id);
    if (!todo) return null;
    todo.done = !todo.done;
    await todo.save();
    return todo;
  },

  async findByIdAndDelete(id) {
    return await Todo.findByIdAndDelete(id);
  },
};

module.exports = todoStore;
