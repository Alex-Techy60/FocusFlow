import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/progress/ProgressBar';
import TaskSection from '../components/tasks/TaskSection';
import './Dashboard.css';

function formatTodayLabel(dateKey) {
  return new Date(dateKey + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function Dashboard() {
  const {
    getTasksForDay,
    addNewTaskToDay,
    toggleTaskForDay,
    removeTaskFromDay,
    addTaskToDay,
    masterTasks,
    todayKey,
    setActivePage,
  } = useApp();

  const today = todayKey();
  const tasks = getTasksForDay(today);
  const completed = tasks.filter((t) => t.completed).length;

  const todayLabel = formatTodayLabel(today);

  const [showForm, setShowForm] = useState(false);
  const [showPickFromLibrary, setShowPickFromLibrary] = useState(false);

  return (
    <div className="dashboard">
      <div className="dashboard-main-column">
        <header className="dashboard-heading">
          <div>
            <h1>Today's Plan</h1>
            <p className="dashboard-date">📅 {todayLabel}</p>
          </div>
          <div className="dashboard-header-actions">
            <button
              className="btn-secondary btn-sm"
              onClick={() => setShowPickFromLibrary((p) => !p)}
            >
              📋 From Library
            </button>
            <button
              className="btn-primary"
              onClick={() => setShowForm((p) => !p)}
            >
              {showForm ? '× Close' : '+ Add Task'}
            </button>
          </div>
        </header>

        {showForm && (
          <QuickAddForm
            onAdd={(data) => { addNewTaskToDay(data, today); setShowForm(false); }}
            onClose={() => setShowForm(false)}
          />
        )}

        {showPickFromLibrary && (
          <PickFromLibrary
            masterTasks={masterTasks}
            todayTasks={tasks}
            onPick={(id) => addTaskToDay(id, today)}
            onClose={() => setShowPickFromLibrary(false)}
          />
        )}

        <TaskSection
          tasks={tasks}
          onToggle={(id) => toggleTaskForDay(id, today)}
          onRemove={(id) => removeTaskFromDay(id, today)}
        />
      </div>

      <aside className="dashboard-side-column" aria-label="Summary">
        <ProgressBar total={tasks.length} completed={completed} />

        <div className="dashboard-quick-stats">
          <div className="quick-stat">
            <span className="quick-stat-num">{tasks.length}</span>
            <span className="quick-stat-label">Planned</span>
          </div>
          <div className="quick-stat">
            <span className="quick-stat-num" style={{ color: '#10b981' }}>{completed}</span>
            <span className="quick-stat-label">Done</span>
          </div>
          <div className="quick-stat">
            <span className="quick-stat-num" style={{ color: '#f59e0b' }}>{tasks.length - completed}</span>
            <span className="quick-stat-label">Remaining</span>
          </div>
        </div>

        <div className="dashboard-nav-shortcuts">
          <h4 className="shortcuts-title">Quick Links</h4>
          <button className="shortcut-btn" onClick={() => setActivePage('My Tasks')}>
            <span>✅</span> All My Tasks
          </button>
          <button className="shortcut-btn" onClick={() => setActivePage('Progress')}>
            <span>📊</span> View Progress
          </button>
          <button className="shortcut-btn" onClick={() => setActivePage('History')}>
            <span>🗂️</span> Browse History
          </button>
          <button className="shortcut-btn" onClick={() => setActivePage('Sessions')}>
            <span>⏱️</span> My Sessions
          </button>
        </div>
      </aside>
    </div>
  );
}

function QuickAddForm({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    onAdd({ title: title.trim(), description: description.trim(), category, priority, completed: false });
  };

  return (
    <form className="dashboard-quick-form" onSubmit={handleSubmit} noValidate>
      <div className="dqf-header">
        <h3>Add Task to Today</h3>
        <button type="button" className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="form-group">
        <input
          className={`form-input ${error ? 'input-error' : ''}`}
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError(''); }}
          placeholder="Task title…"
          autoFocus
        />
        {error && <span className="form-error">{error}</span>}
      </div>
      <div className="form-group">
        <textarea
          className="form-input form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)…"
          rows={2}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {['Work','Study','Personal','Health','General'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
            {['High','Medium','Low'].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-primary">Add to Today</button>
      </div>
    </form>
  );
}

function PickFromLibrary({ masterTasks, todayTasks, onPick, onClose }) {
  const [search, setSearch] = useState('');
  const todayIds = new Set(todayTasks.map((t) => t.id));
  const available = masterTasks.filter(
    (t) => !todayIds.has(t.id) && t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pick-library-panel">
      <div className="dqf-header">
        <h3>Pick from Library</h3>
        <button type="button" className="close-btn" onClick={onClose}>×</button>
      </div>
      <input
        className="form-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search tasks…"
        autoFocus
      />
      {available.length === 0 ? (
        <p className="pick-empty">
          {masterTasks.length === 0
            ? 'Your library is empty. Create tasks in My Tasks first.'
            : 'All library tasks are already in today\'s plan.'}
        </p>
      ) : (
        <ul className="pick-list">
          {available.map((t) => (
            <li key={t.id} className="pick-item">
              <div className="pick-item-info">
                <span className={`priority-dot priority-dot-${(t.priority||'medium').toLowerCase()}`}></span>
                <span className="pick-item-title">{t.title}</span>
                <span className="badge badge-cat">{t.category}</span>
              </div>
              <button className="btn-primary btn-sm" onClick={() => onPick(t.id)}>
                + Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
