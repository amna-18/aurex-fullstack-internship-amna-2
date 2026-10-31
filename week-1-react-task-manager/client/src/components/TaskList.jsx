import TaskItem from './TaskItem'

function TaskList({ tasks, filter, onToggleTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return (
      <div className="empty">
        <p className="empty__icon">⛅</p>
        <p>
          {filter === 'all'
            ? 'Nothing here yet — add your first task above.'
            : 'No tasks in this view.'}
        </p>
      </div>
    )
  }

  return (
    <ul className="list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
        />
      ))}
    </ul>
  )
}

export default TaskList