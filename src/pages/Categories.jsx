import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Categories.css';

const CATEGORY_META = {
  Work:     { icon: '💼', color: '#3b82f6', bg: '#eff6ff' },
  Study:    { icon: '📚', color: '#8b5cf6', bg: '#f5f3ff' },
  Personal: { icon: '🌟', color: '#f59e0b', bg: '#fffbeb' },
  Health:   { icon: '💪', color: '#10b981', bg: '#ecfdf5' },
  General:  { icon: '📌', color: '#6b7280', bg: '#f9fafb' },
};

function Categories() {
  const { masterTasks, addMasterTask, deleteMasterTask, addTaskToDay, todayKey } = useApp();
  const [expandedCat, setExpandedCat] = useState(null);
  const [addingTo, setAddingTo] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');

  const grouped = Object.keys(CATEGORY_META).reduce((acc, cat) => {
    acc[cat] = masterTasks.filter((t) => (t.category || 'General') === cat);
    return acc;
  }, {});

  const handleQuickAdd = (cat) => {
    if (!newTitle.trim()) return;
    const id = addMasterTask({ title: newTitle.trim(), description: '', category: cat, priority: newPriority, completed: false });
    setNewTitle('');
    setAddingTo(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Browse your tasks organized by category</p>
        </div>
      </div>

      <div className="categories-grid">
        {Object.entries(CATEGORY_META).map(([cat, meta]) => {
          const tasks = grouped[cat] || [];
          const isOpen = expandedCat === cat;
          const completed = tasks.filter(t => t.completed).length;

          return (
            <div key={cat} className="category-card" style={{ '--cat-color': meta.color, '--cat-bg': meta.bg }}>
              <div className="category-card-header" onClick={() => setExpandedCat(isOpen ? null : cat)}>
                <div className="category-icon-wrap" style={{ background: meta.bg }}>
                  <span className="category-icon">{meta.icon}</span>
                </div>
                <div className="category-info">
                  <h3 className="category-name">{cat}</h3>
                  <span className="category-count">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="category-mini-progress">
                  <div className="mini-progress-bar">
                    <div
                      className="mini-progress-fill"
                      style={{ width: tasks.length ? `${Math.round((completed / tasks.length) * 100)}%` : '0%', background: meta.color }}
                    />
                  </div>
                  <span className="mini-progress-text" style={{ color: meta.color }}>
                    {tasks.length ? `${Math.round((completed / tasks.length) * 100)}%` : '—'}
                  </span>
                </div>
                <span className={`expand-arrow ${isOpen ? 'expanded' : ''}`}>›</span>
              </div>

              {isOpen && (
                <div className="category-task-list">
                  {tasks.length === 0 ? (
                    <div className="cat-empty">No tasks in this category yet.</div>
                  ) : (
                    tasks.map((task) => (
                      <div key={task.id} className="cat-task-row">
                        <span className={`priority-dot priority-dot-${(task.priority||'medium').toLowerCase()}`}></span>
                        <span className="cat-task-title">{task.title}</span>
                        <div className="cat-task-actions">
                          <button
                            className="btn-add-to-today-sm"
                            onClick={() => addTaskToDay(task.id, todayKey())}
                            title="Add to today"
                          >+ Today</button>
                          <button
                            className="btn-icon-sm btn-delete"
                            onClick={() => deleteMasterTask(task.id)}
                            title="Delete"
                          >🗑️</button>
                        </div>
                      </div>
                    ))
                  )}

                  {addingTo === cat ? (
                    <div className="cat-quick-add">
                      <input
                        className="form-input"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Task title…"
                        autoFocus
                        onKeyDown={(e) => { if (e.key === 'Enter') handleQuickAdd(cat); if (e.key === 'Escape') setAddingTo(null); }}
                      />
                      <select className="form-input form-select-sm" value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                        <option>High</option><option>Medium</option><option>Low</option>
                      </select>
                      <div className="cat-quick-add-actions">
                        <button className="btn-primary btn-sm" onClick={() => handleQuickAdd(cat)}>Add</button>
                        <button className="btn-secondary btn-sm" onClick={() => setAddingTo(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button className="cat-add-btn" onClick={() => { setAddingTo(cat); setNewTitle(''); }}>
                      + Add task to {cat}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Categories;
