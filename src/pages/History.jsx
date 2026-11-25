import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './History.css';

function formatDateKey(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch { return dateStr; }
}

function getDatesWithActivity(dailyPlans) {
  return Object.keys(dailyPlans)
    .filter((d) => (dailyPlans[d] || []).length > 0)
    .sort((a, b) => b.localeCompare(a));
}

function History() {
  const { dailyPlans, getTasksForDay, toggleTaskForDay, historyDate, setHistoryDate, setActivePage } = useApp();

  const activeDates = getDatesWithActivity(dailyPlans);
  const selectedTasks = getTasksForDay(historyDate);
  const isToday = historyDate === new Date().toISOString().slice(0, 10);

  const completed = selectedTasks.filter((t) => t.completed).length;
  const pct = selectedTasks.length ? Math.round((completed / selectedTasks.length) * 100) : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">History</h1>
          <p className="page-subtitle">Browse any day's task list and progress</p>
        </div>
      </div>

      <div className="history-layout">
        {/* Date picker panel */}
        <aside className="history-date-panel">
          <div className="history-date-input-wrap">
            <label className="date-picker-label">Pick a date</label>
            <input
              type="date"
              className="form-input"
              value={historyDate}
              onChange={(e) => setHistoryDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>

          {activeDates.length > 0 && (
            <div className="history-active-dates">
              <h4 className="active-dates-title">Days with activity</h4>
              <ul className="active-dates-list">
                {activeDates.map((date) => {
                  const tasks = (dailyPlans[date] || []).length;
                  return (
                    <li key={date}>
                      <button
                        className={`active-date-btn ${historyDate === date ? 'active-date-active' : ''}`}
                        onClick={() => setHistoryDate(date)}
                      >
                        <span>{date === new Date().toISOString().slice(0, 10) ? '📍 Today' : date}</span>
                        <span className="active-date-count">{tasks} task{tasks !== 1 ? 's' : ''}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </aside>

        {/* Day detail panel */}
        <div className="history-detail-panel">
          <div className="history-day-header">
            <div>
              <h2 className="history-day-title">
                {isToday ? '📍 Today' : formatDateKey(historyDate)}
              </h2>
              {selectedTasks.length > 0 && (
                <p className="history-day-summary">
                  {completed} of {selectedTasks.length} tasks completed
                </p>
              )}
            </div>
            {selectedTasks.length > 0 && (
              <div className="history-pct-badge" style={{
                background: pct >= 80 ? '#dcfce7' : pct >= 50 ? '#fef3c7' : '#fee2e2',
                color: pct >= 80 ? '#15803d' : pct >= 50 ? '#b45309' : '#b91c1c'
              }}>
                {pct}%
              </div>
            )}
          </div>

          {selectedTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No tasks for this day</h3>
              <p>
                {isToday
                  ? 'Go to Dashboard to add tasks to today\'s plan.'
                  : 'No tasks were planned for this day.'}
              </p>
              {isToday && (
                <button className="btn-primary" onClick={() => setActivePage('Dashboard')}>
                  Go to Dashboard
                </button>
              )}
            </div>
          ) : (
            <div className="history-tasks">
              {/* Progress bar */}
              <div className="history-progress-bar-wrap">
                <div className="history-progress-bar">
                  <div className="history-progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="history-progress-label">{pct}% complete</span>
              </div>

              <div className="history-task-list">
                {selectedTasks.map((task) => (
                  <div key={task.id} className={`history-task-item ${task.completed ? 'history-task-done' : ''}`}>
                    <label className="history-task-check-label">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskForDay(task.id, historyDate)}
                        className="toggle-checkbox"
                      />
                      <div className="history-task-info">
                        <span className="history-task-title">{task.title}</span>
                        {task.description && (
                          <span className="history-task-desc">{task.description}</span>
                        )}
                      </div>
                    </label>
                    <div className="history-task-badges">
                      <span className="badge badge-cat">{task.category || 'General'}</span>
                      <span className={`badge badge-pri badge-pri-${(task.priority || 'medium').toLowerCase()}`}>
                        {task.priority || 'Medium'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
