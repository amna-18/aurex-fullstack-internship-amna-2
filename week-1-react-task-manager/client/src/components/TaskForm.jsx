import { useState } from 'react'

function TaskForm({ onAddTask }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setText(event.target.value)
    if (error) setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = text.trim()

    if (trimmed === '') {
      setError('Write something first. A task can’t be empty.')
      return
    }

    onAddTask({ text: trimmed, priority, dueDate })
    setText('')
    setDueDate('')
    setError('')
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form__fields">
        <input
          className={`field${error ? ' field--invalid' : ''}`}
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="What needs doing?"
          aria-label="New task"
        />
        <select
          className="field"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          aria-label="Priority"
        >
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input
          className="field"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
        />
      </div>
      {error && (
        <p className="form__error" role="alert">
          {error}
        </p>
      )}
      <button className="btn btn--primary" type="submit">
        Add task
      </button>
    </form>
  )
}

export default TaskForm