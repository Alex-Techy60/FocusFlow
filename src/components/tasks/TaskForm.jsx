import React from 'react'

function TaskForm({ initialTask = null, onClose }) {
  return (
    <div className='task-item task-item-editing'>
      <p>
        {initialTask ? `Editing: ${initialTask.title}` : 'Add New Task Form'}
      </p>
      {onClose && (
        <button type='button' className='cancel-button' onClick={onClose}>
          Cancel
        </button>
      )}
    </div>
  )
}

export default TaskForm