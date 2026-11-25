import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './MyTasks.css';

const CATEGORIES = ['All', 'Work', 'Study', 'Personal', 'Health', 'General'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];

function MyTasks() {
  const { masterTasks, addMasterTask, updateMasterTask, deleteMasterTask, addTaskToDay, todayKey } = useApp();
  const [filterCat, setFilterCat] = useState('All');
  const [filterPri, setFilterPri] = useState('All');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const filtered = masterTasks.filter((t) => {
    const matchCat = filterCat === 'All' || t.category === filterCat;
    const matchPri = filterPri === 'All' || t.priority === filterPri;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchPri && matchSearch;
  });

  const handleAddToToday = (taskId) => {
    addTaskToDay(taskId, todayKey());
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Your complete task library — add tasks to any day's plan</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditTask(null); setShowForm(true); }}>
          <span>+</span> New Task
        </button>
      </div>

      {showForm && (
        <TaskLibraryForm
          initialTask={editTask}
          onClose={() => { setShowForm(false); setEditTask(null); }}
          onSave={(data) => {
            if (editTask) updateMasterTask(editTask.id, data);
            else addMasterTask(data);
            setShowForm(false);
            setEditTask(null);
          }}
        />
      )}

      {/* Filters */}
      <div className="filters-row">
        <input
          className="search-input"
          type="text"
          placeholder="🔍  Search tasks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-chips">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`chip ${filterCat === c ? 'chip-active' : ''}`}
              onClick={() => setFilterCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="filter-chips">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              className={`chip priority-chip-${p.toLowerCase()} ${filterPri === p ? 'chip-active' : ''}`}
              onClick={() => setFilterPri(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No tasks found</h3>
          <p>{masterTasks.length === 0 ? 'Create your first task to get started!' : 'Try adjusting your filters.'}</p>
        </div>
      ) : (
        <div className="task-library-grid">
          {filtered.map((task) => (
            <div key={task.id} className="library-task-card">
              <div className="library-task-top">
                <span className={`priority-dot priority-dot-${(task.priority || 'medium').toLowerCase()}`}></span>
                <span className="library-task-title">{task.title}</span>
              </div>
              {task.description && (
                <p className="library-task-desc">{task.description}</p>
              )}
              <div className="library-task-footer">
                <span className="badge badge-cat">{task.category || 'General'}</span>
                <span className={`badge badge-pri badge-pri-${(task.priority || 'medium').toLowerCase()}`}>
                  {task.priority || 'Medium'}
                </span>
                <span className="library-task-date">Created {task.createdAt || '—'}</span>
              </div>
              <div className="library-task-actions">
                <button
                  className="btn-add-to-today"
                  onClick={() => handleAddToToday(task.id)}
                  title="Add to today's plan"
                >
                  ➕ Add to Today
                </button>
                <button
                  className="btn-icon-sm btn-edit"
                  onClick={() => { setEditTask(task); setShowForm(true); }}
                  title="Edit"
                >✏️</button>
                <button
                  className="btn-icon-sm btn-delete"
                  onClick={() => deleteMasterTask(task.id)}
                  title="Delete"
                >🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TaskLibraryForm({ initialTask, onClose, onSave }) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [category, setCategory] = useState(initialTask?.category || 'Work');
  const [priority, setPriority] = useState(initialTask?.priority || 'Medium');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Task title is required.'); return; }
    onSave({ title: title.trim(), description: description.trim(), category, priority, completed: false });
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <form className="task-lib-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} noValidate>
        <div className="form-header">
          <h3>{initialTask ? 'Edit Task' : 'Create New Task'}</h3>
          <button type="button" className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="form-group">
          <label>Task Title <span className="req">*</span></label>
          <input
            className={`form-input ${error ? 'input-error' : ''}`}
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(''); }}
            placeholder="e.g., Review project proposal"
            autoFocus
          />
          {error && <span className="form-error">{error}</span>}
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-input form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details…"
            rows={3}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {['Work','Study','Personal','Health','General'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
              {['High','Medium','Low'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{initialTask ? 'Save Changes' : 'Create Task'}</button>
        </div>
      </form>
    </div>
  );
}

export default MyTasks;
