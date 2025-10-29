import { useState, useEffect } from 'react'
import { taskAPI } from '../services/api'
import TaskList from './TaskList'
import TaskForm from './TaskForm'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const tasksData = await taskAPI.getTasks()
      setTasks(tasksData)
      setError('')
    } catch (err) {
      setError('Failed to load tasks')
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskAPI.createTask(taskData)
      setTasks([newTask, ...tasks])
      setShowForm(false)
      setError('')
    } catch (err) {
      setError('Failed to create task')
      console.error('Error creating task:', err)
    }
  }

  const handleUpdateTask = async (id, taskData) => {
    try {
      const updatedTask = await taskAPI.updateTask(id, taskData)
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
      setEditingTask(null)
      setError('')
    } catch (err) {
      setError('Failed to update task')
      console.error('Error updating task:', err)
    }
  }

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      await taskAPI.deleteTask(id)
      setTasks(tasks.filter(task => task.id !== id))
      setError('')
    } catch (err) {
      setError('Failed to delete task')
      console.error('Error deleting task:', err)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <p>Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>My Tasks</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add New Task
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {showForm && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? 
              (taskData) => handleUpdateTask(editingTask.id, taskData) : 
              handleCreateTask
            }
            onCancel={handleCancelForm}
          />
        )}

        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  )
}

export default Dashboard
