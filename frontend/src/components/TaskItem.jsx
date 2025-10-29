import { useState } from 'react'

function TaskItem({ task, onEdit, onDelete }) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusToggle = async () => {
    if (isUpdating) return
    
    setIsUpdating(true)
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending'
      await onEdit(task, { ...task, status: newStatus })
    } catch (error) {
      console.error('Error updating task status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`task-status ${task.status}`}>
          {task.status}
        </span>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-actions">
        <button
          className={`btn ${task.status === 'pending' ? 'btn-success' : 'btn-secondary'}`}
          onClick={handleStatusToggle}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 
           task.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
        </button>
        
        <button
          className="btn btn-secondary"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        
        <button
          className="btn btn-danger"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
      
      <div className="task-meta">
        Created: {formatDate(task.createdAt)}
        {task.updatedAt !== task.createdAt && (
          <span> • Updated: {formatDate(task.updatedAt)}</span>
        )}
      </div>
    </div>
  )
}

export default TaskItem
