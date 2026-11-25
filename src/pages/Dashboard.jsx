import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import ProgressBar from '../components/progress/ProgressBar';
import TaskSection from '../components/tasks/TaskSection';
import TaskForm from '../components/tasks/TaskForm';
import './Dashboard.css';

function Dashboard() {
  const { tasks } = useTask();
  const [isAddingTask, setIsAddingTask] = useState(false);

  const completedTasks = tasks.filter((task) => task.completed);

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="dashboard">
      <div className="dashboard-main-column">
        <header className="dashboard-heading">
          <h1>Dashboard</h1>
          <p className="dashboard-date">{todayLabel}</p>
        </header>

        {isAddingTask && (
          <TaskForm onClose={() => setIsAddingTask(false)} />
        )}

        <TaskSection tasks={tasks} />
      </div>

      <aside className="dashboard-side-column" aria-label="Dashboard summary and actions">
        <button
          type="button"
          className="add-task-cta"
          onClick={() => setIsAddingTask((prev) => !prev)}
        >
          <span className="add-task-plus">{isAddingTask ? '×' : '+'}</span>
          <span>{isAddingTask ? 'Close Form' : 'Add New Task'}</span>
        </button>

        <ProgressBar
          total={tasks.length}
          completed={completedTasks.length}
        />

      </aside>
    </div>
  );
}

export default Dashboard;