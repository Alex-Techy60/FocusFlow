import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onToggle, onRemove }) {
  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        No tasks in this section yet
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem task={task} onToggle={onToggle} onRemove={onRemove} />
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
