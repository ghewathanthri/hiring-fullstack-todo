const mongoose = require('mongoose');
const { TITLE_MAX, DESCRIPTION_MAX } = require('../constants/todoLimits');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [TITLE_MAX, `Title cannot exceed ${TITLE_MAX} characters`],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [
        DESCRIPTION_MAX,
        `Description cannot exceed ${DESCRIPTION_MAX} characters`,
      ],
      default: '',
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Transform _id to id in JSON responses
todoSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Todo', todoSchema);
