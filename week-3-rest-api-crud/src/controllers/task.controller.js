import Task from '../models/Task.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HttpError } from '../utils/HttpError.js'
import { PRIORITIES, escapeRegex, parseTaskInput } from '../utils/taskInput.js'

// GET /api/tasks?completed=true|false&priority=low|medium|high&search=text
export const getTasks = asyncHandler(async (req, res) => {
  const { completed, priority, search } = req.query
  const filter = {}

  if (completed !== undefined) {
    if (completed !== 'true' && completed !== 'false') {
      throw new HttpError(400, 'Query "completed" must be true or false')
    }
    filter.completed = completed === 'true'
  }

  if (priority !== undefined) {
    if (!PRIORITIES.includes(priority)) {
      throw new HttpError(400, 'Query "priority" must be low, medium or high')
    }
    filter.priority = priority
  }

  if (typeof search === 'string' && search.trim() !== '') {
    filter.text = { $regex: escapeRegex(search.trim()), $options: 'i' }
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 })
  res.status(200).json({ success: true, count: tasks.length, data: tasks })
})

// GET /api/tasks/:id
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
  if (!task) throw new HttpError(404, 'Task not found')
  res.status(200).json({ success: true, data: task })
})

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const { data, errors } = parseTaskInput(req.body, { requireText: true })
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', '), errors })
  }

  const task = await Task.create(data)
  res.status(201).json({ success: true, data: task })
})

// PUT /api/tasks/:id   (send only the fields you want to change)
export const updateTask = asyncHandler(async (req, res) => {
  const { data, errors } = parseTaskInput(req.body, { requireText: false })
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', '), errors })
  }
  if (Object.keys(data).length === 0) {
    throw new HttpError(400, 'Send at least one field to update: text, priority, dueDate or completed')
  }

  const task = await Task.findByIdAndUpdate(req.params.id, data, {
    new: true, // return the updated document
    runValidators: true, // apply the schema rules to the update as well
  })
  if (!task) throw new HttpError(404, 'Task not found')

  res.status(200).json({ success: true, data: task })
})

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id)
  if (!task) throw new HttpError(404, 'Task not found')

  res.status(200).json({ success: true, message: 'Task deleted', data: { id: task.id } })
})
