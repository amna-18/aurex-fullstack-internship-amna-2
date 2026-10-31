import { Router } from 'express'
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from '../controllers/task.controller.js'
import { validateObjectId } from '../middleware/validateObjectId.js'

const router = Router()

// /api/tasks
router.route('/').get(getTasks).post(createTask)

// /api/tasks/:id   (the id is validated once, before any of the handlers run)
router.route('/:id').all(validateObjectId).get(getTask).put(updateTask).delete(deleteTask)

export default router
