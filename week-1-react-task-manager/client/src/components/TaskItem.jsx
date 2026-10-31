function formatDate(dateString) {
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`item${task.completed ? ' item--done' : ''}`}>
      <label className="item__label">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <div>
          <span className="item__text">{task.text}</span>
          <div className="item__meta">
            <span className={`badge badge--${task.priority}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="item__date">Due {formatDate(task.dueDate)}</span>
            )}
          </div>
        </div>
      </label>
      <button
        className="btn btn--ghost"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task: ${task.text}`}
      >
        Delete
      </button>
    </li>
  )
}

export default TaskItem