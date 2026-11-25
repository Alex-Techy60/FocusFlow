import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';

function TaskForm({ initialTask = null, onClose }) {
  const { addTask, updateTask } = useTask();
  const isEditMode = Boolean(initialTask);

  const [title, setTitle] = useState(initialTask ? initialTask.title : '');
  const [description, setDescription] = useState(
    initialTask ? initialTask.description || '' : ''
  );
  const [category, setCategory] = useState(
    initialTask ? initialTask.category || 'Work' : 'Work'
  );
  const [priority, setPriority] = useState(
    initialTask ? initialTask.priority || 'Medium' : 'Medium'
  );
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a task title.');
      return;
    }

    if (isEditMode) {
      updateTask(initialTask.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
      });
    } else {
      const formattedDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      });

      addTask({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        date: formattedDate,
        completed: false,
      });
    }

    if (onClose) {
      onClose();
    }
  };

  return (
    <form
      className={`task-form ${isEditMode ? 'task-form-edit' : 'task-form-create'}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="task-form-header">
        <h3 className="task-form-heading">
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </h3>
      </div>

      <div className="task-form-group">
        <label htmlFor={`task-title-${initialTask?.id || 'new'}`} className="task-form-label">
          Task Title <span className="required-star">*</span>
        </label>
        <input
          id={`task-title-${initialTask?.id || 'new'}`}
          type="text"
          className={`task-form-input ${error ? 'input-error' : ''}`}
          placeholder="e.g., Complete FocusFlow project"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          autoFocus
        />
        {error && <span className="task-form-error">{error}</span>}
      </div>

      <div className="task-form-group">
        <label htmlFor={`task-desc-${initialTask?.id || 'new'}`} className="task-form-label">
          Description
        </label>
        <textarea
          id={`task-desc-${initialTask?.id || 'new'}`}
          className="task-form-textarea"
          placeholder="Add details, links, or notes (optional)..."
          rows="2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="task-form-row">
        <div className="task-form-group">
          <label htmlFor={`task-cat-${initialTask?.id || 'new'}`} className="task-form-label">
            Category
          </label>
          <select
            id={`task-cat-${initialTask?.id || 'new'}`}
            className="task-form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
            <option value="Health">Health</option>
            <option value="General">General</option>
          </select>
        </div>

        <div className="task-form-group">
          <label htmlFor={`task-prio-${initialTask?.id || 'new'}`} className="task-form-label">
            Priority
          </label>
          <select
            id={`task-prio-${initialTask?.id || 'new'}`}
            className="task-form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="task-form-actions">
        {onClose && (
          <button
            type="button"
            className="task-form-btn btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
        )}
        <button type="submit" className="task-form-btn btn-submit">
          {isEditMode ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;