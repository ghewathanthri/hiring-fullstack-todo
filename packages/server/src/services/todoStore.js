const Todo = require('../models/Todo');

const todoStore = {
  async find() {
    return await Todo.find().sort({ position: 1, createdAt: -1 });
  },

  // New todos go to the top of the list
  async create({ title, description }) {
    const first = await Todo.findOne().sort({ position: 1 }).select('position');
    const position = first?.position != null ? first.position - 1 : 0;
    return await Todo.create({ title, description, position });
  },

  // Assigns positions 0..n-1 to the given ids, in order
  async reorder(ids) {
    await Todo.bulkWrite(
      ids.map((id, index) => ({
        updateOne: { filter: { _id: id }, update: { position: index } },
      }))
    );
    return await this.find();
  },

  // Gives todos created before ordering existed a position, newest first
  async backfillPositions() {
    const missing = await Todo.find({ position: { $exists: false } })
      .sort({ createdAt: -1 })
      .select('_id');
    if (missing.length === 0) return;

    const last = await Todo.findOne({ position: { $exists: true } })
      .sort({ position: -1 })
      .select('position');
    const start = last ? last.position + 1 : 0;

    await Todo.bulkWrite(
      missing.map((todo, index) => ({
        updateOne: { filter: { _id: todo._id }, update: { position: start + index } },
      }))
    );
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
