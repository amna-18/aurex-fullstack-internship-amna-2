import { useState } from 'react'
import Header from './components/Header'
import TaskForm from './components/TaskForm'
import FilterBar from './components/FilterBar'
import TaskList from './components/TaskList'

function App() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [theme, setTheme] = useState('light')

  const addTask = ({ text, priority, dueDate }) => {
    const newTask = { id: Date.now(), text, priority, dueDate, completed: false }
    setTasks((prev) => [...prev, newTask])
  }

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const completed = tasks.filter((task) => task.completed).length
  const active = tasks.length - completed

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  return (
    <div className="page" data-theme={theme}>
      <main className="container">
        <Header
          total={tasks.length}
          active={active}
          completed={completed}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <TaskForm onAddTask={addTask} />
        <FilterBar filter={filter} onChangeFilter={setFilter} />
        <TaskList
          tasks={visibleTasks}
          filter={filter}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      </main>
    </div>
  )
}

export default App