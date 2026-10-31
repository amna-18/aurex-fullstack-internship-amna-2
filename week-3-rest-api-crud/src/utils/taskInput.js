export const PRIORITIES = ['low', 'medium', 'high']

// Escapes characters that have a special meaning in a regular expression,
// so a search for "c++" is treated as plain text.
export function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Takes the raw request body and returns only the fields we accept, cleaned up,
// plus a list of human-readable problems. Anything unknown (e.g. "_id") is ignored.
//   requireText = true  -> used by POST (a task must have text)
//   requireText = false -> used by PUT (send only the fields you want to change)
export function parseTaskInput(body, { requireText }) {
  const input = body && typeof body === 'object' && !Array.isArray(body) ? body : {}
  const data = {}
  const errors = []

  if (input.text !== undefined || requireText) {
    if (typeof input.text !== 'string' || input.text.trim() === '') {
      errors.push('Task text is required')
    } else if (input.text.trim().length > 200) {
      errors.push('Task text cannot be longer than 200 characters')
    } else {
      data.text = input.text.trim()
    }
  }

  if (input.priority !== undefined) {
    if (!PRIORITIES.includes(input.priority)) {
      errors.push('Priority must be low, medium or high')
    } else {
      data.priority = input.priority
    }
  }

  if (input.completed !== undefined) {
    if (typeof input.completed !== 'boolean') {
      errors.push('Completed must be true or false')
    } else {
      data.completed = input.completed
    }
  }

  if (input.dueDate !== undefined) {
    if (input.dueDate === null || input.dueDate === '') {
      data.dueDate = null // clears the due date
    } else {
      const date = typeof input.dueDate === 'string' ? new Date(input.dueDate) : null
      if (!date || Number.isNaN(date.getTime())) {
        errors.push('Due date must be a valid date (YYYY-MM-DD)')
      } else {
        data.dueDate = date
      }
    }
  }

  return { data, errors }
}
