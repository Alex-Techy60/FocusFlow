import React, { useState } from "react";
import TaskList from "./TaskList";
import './Task.css';

function TaskSection({ tasks = [], onToggle, onRemove }) {
  const [status, setStatus] = useState('pending');

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const allTasks = tasks;

  const filteredTasks =
    status === 'pending' ? pendingTasks :
    status === 'completed' ? completedTasks :
    allTasks;

  const tabs = [
    { id: 'pending',   label: 'Pending',   count: pendingTasks.length },
    { id: 'completed', label: 'Completed', count: completedTasks.length },
    { id: 'all',       label: 'All',       count: allTasks.length },
  ];

  return (
    <section className="task-section">
      <div className="task-section-header">
        <div className="task-tabs" role="tablist" aria-label="Task status filter">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={status === tab.id}
              className={`task-tab ${status === tab.id ? 'active' : ''}`}
              onClick={() => setStatus(tab.id)}
            >
              <span>{tab.label}</span>
              <span className="task-tab-count">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="task-list-empty">
          {status === 'pending' && tasks.length > 0
            ? '🎉 All tasks completed for today!'
            : status === 'completed' && tasks.length > 0
            ? 'No completed tasks yet.'
            : tasks.length === 0
            ? 'No tasks in today\'s plan. Add a task above!'
            : 'No tasks here.'}
        </div>
      ) : (
        <TaskList tasks={filteredTasks} onToggle={onToggle} onRemove={onRemove} />
      )}
    </section>
  );
}

export default TaskSection;
