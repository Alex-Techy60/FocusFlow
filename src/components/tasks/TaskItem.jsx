import React, { useState } from 'react';
import deleteIcon from '../../assets/delete-button.svg';

function TaskItem({ task, onToggle, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const priority = task.priority || 'Medium';

  return (
    <div className={`task-item ${task.completed ? 'task-completed' : ''}`}>
      <div className="task-item-main-area">
        <div className="task-left">
          <input
            type="checkbox"
            id={`toggle-task-${task.id}`}
            className="toggle-checkbox"
            checked={Boolean(task.completed)}
            onChange={() => onToggle && onToggle(task.id)}
          />
          <label htmlFor={`toggle-task-${task.id}`} className="task-title">
            {task.title}
          </label>
        </div>

        <div className="task-actions">
          {task.description && (
            <button
              type="button"
              className="icon-button expand-btn"
              onClick={() => setExpanded((p) => !p)}
              aria-label="Toggle description"
              title="Details"
            >
              {expanded ? '▲' : '▼'}
            </button>
          )}
          <button
            type="button"
            className="icon-button delete-task-button"
            onClick={() => onRemove && onRemove(task.id)}
            aria-label="Remove from today"
            title="Remove from today's plan"
          >
            <img src={deleteIcon} alt="remove" className="action-icon" />
          </button>
        </div>
      </div>

      {expanded && task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-item-footer">
        <span className="task-badge task-category">{task.category || 'General'}</span>
        <span className={`task-badge task-priority task-priority-${priority.toLowerCase()}`}>
          {priority}
        </span>
        {task.createdAt && (
          <span className="task-date">Created {task.createdAt}</span>
        )}
      </div>
    </div>
  );
}

export default TaskItem;
