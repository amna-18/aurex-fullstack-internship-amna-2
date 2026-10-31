import mongoose from 'mongoose'

// A Schema describes what a document in the "tasks" collection looks like.
// The fields match the task objects used by the React app since Week 1.
const taskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Task text is required'],
      trim: true,
      maxlength: [200, 'Task text cannot be longer than 200 characters'],
    },
    priority: {
      type: String,
      enum: { values: ['low', 'medium', 'high'], message: 'Priority must be low, medium or high' },
      default: 'medium',
    },
    dueDate: { type: Date, default: null },
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    toJSON: {
      virtuals: true,
      versionKey: false,
      // Send "id" to the client instead of MongoDB's "_id".
      transform: (_doc, ret) => {
        ret.id = ret.id ?? String(ret._id)
        delete ret._id
        return ret
      },
    },
  }
)

taskSchema.index({ createdAt: -1 })

const Task = mongoose.model('Task', taskSchema)

export default Task
