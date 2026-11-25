import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Sessions.css';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function Sessions() {
  const { sessions, addSession, updateSession, deleteSession } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editSession, setEditSession] = useState(null);

  const handleSave = (data) => {
    if (editSession) updateSession(editSession.id, data);
    else addSession(data);
    setShowForm(false);
    setEditSession(null);
  };

  if (sessions.length === 0 && !showForm) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Sessions</h1>
            <p className="page-subtitle">Define your daily schedule blocks</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ New Session</button>
        </div>
        <div className="empty-state sessions-empty">
          <div className="empty-icon">🗓️</div>
          <h3>No sessions set up yet</h3>
          <p>Create your first daily schedule block — like Work from 9AM to 3PM, Study from 4PM to 6PM, etc.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>Create Your First Session</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sessions</h1>
          <p className="page-subtitle">Your daily schedule blocks</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditSession(null); setShowForm(true); }}>
          + New Session
        </button>
      </div>

      {showForm && (
        <SessionForm
          initialSession={editSession}
          onClose={() => { setShowForm(false); setEditSession(null); }}
          onSave={handleSave}
        />
      )}

      <div className="sessions-timeline-layout">
        {/* Timeline visual */}
        <div className="sessions-list">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onEdit={() => { setEditSession(session); setShowForm(true); }}
              onDelete={() => deleteSession(session.id)}
            />
          ))}
        </div>

        {/* Weekly overview */}
        <div className="week-grid-panel">
          <h3 className="panel-title">Weekly Overview</h3>
          <div className="week-grid">
            {DAYS.map((day) => (
              <div key={day} className="week-col">
                <div className="week-day-label">{day}</div>
                <div className="week-slots">
                  {sessions
                    .filter((s) => !s.days || s.days.includes(day) || s.days.length === 0)
                    .map((s) => (
                      <div
                        key={s.id}
                        className="week-slot"
                        style={{ background: s.color || '#3b82f6' }}
                        title={`${s.label}: ${s.timeSlots?.map(ts => `${ts.start}–${ts.end}`).join(', ')}`}
                      >
                        <span>{s.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionCard({ session, onEdit, onDelete }) {
  return (
    <div className="session-card" style={{ '--session-color': session.color || '#3b82f6' }}>
      <div className="session-card-header">
        <div className="session-color-dot" style={{ background: session.color || '#3b82f6' }}></div>
        <h3 className="session-label">{session.label}</h3>
        <div className="session-actions">
          <button className="btn-icon-sm" onClick={onEdit} title="Edit">✏️</button>
          <button className="btn-icon-sm btn-delete" onClick={onDelete} title="Delete">🗑️</button>
        </div>
      </div>
      {session.description && <p className="session-desc">{session.description}</p>}
      <div className="session-slots">
        {(session.timeSlots || []).map((slot, i) => (
          <div key={i} className="session-slot-pill">
            <span className="slot-time">⏰ {slot.start} – {slot.end}</span>
          </div>
        ))}
      </div>
      {session.days && session.days.length > 0 && (
        <div className="session-days">
          {DAYS.map((d) => (
            <span key={d} className={`day-chip ${session.days.includes(d) ? 'day-active' : ''}`}>
              {d}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SessionForm({ initialSession, onClose, onSave }) {
  const [label, setLabel] = useState(initialSession?.label || '');
  const [description, setDescription] = useState(initialSession?.description || '');
  const [color, setColor] = useState(initialSession?.color || '#3b82f6');
  const [days, setDays] = useState(initialSession?.days || [...DAYS]);
  const [timeSlots, setTimeSlots] = useState(
    initialSession?.timeSlots?.length ? initialSession.timeSlots : [{ start: '09:00', end: '12:00' }]
  );
  const [error, setError] = useState('');

  const toggleDay = (d) => {
    setDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  };

  const addSlot = () => setTimeSlots((prev) => [...prev, { start: '14:00', end: '16:00' }]);
  const removeSlot = (i) => setTimeSlots((prev) => prev.filter((_, idx) => idx !== i));
  const updateSlot = (i, field, value) =>
    setTimeSlots((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) { setError('Session name is required.'); return; }
    onSave({ label: label.trim(), description: description.trim(), color, days, timeSlots });
  };

  const COLORS = ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4','#f97316','#ec4899'];

  return (
    <div className="form-overlay" onClick={onClose}>
      <form className="session-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} noValidate>
        <div className="form-header">
          <h3>{initialSession ? 'Edit Session' : 'Create New Session'}</h3>
          <button type="button" className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="form-group">
          <label>Session Name <span className="req">*</span></label>
          <input
            className={`form-input ${error ? 'input-error' : ''}`}
            value={label}
            onChange={(e) => { setLabel(e.target.value); setError(''); }}
            placeholder="e.g., Work, Study, Gym…"
            autoFocus
          />
          {error && <span className="form-error">{error}</span>}
        </div>

        <div className="form-group">
          <label>Description (optional)</label>
          <input
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Deep work session for project tasks"
          />
        </div>

        <div className="form-group">
          <label>Color</label>
          <div className="color-picker">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`color-swatch ${color === c ? 'color-selected' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Days</label>
          <div className="day-selector">
            {DAYS.map((d) => (
              <button
                key={d}
                type="button"
                className={`day-toggle ${days.includes(d) ? 'day-toggle-active' : ''}`}
                onClick={() => toggleDay(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <div className="slots-header">
            <label>Time Slots</label>
            <button type="button" className="btn-link" onClick={addSlot}>+ Add Slot</button>
          </div>
          {timeSlots.map((slot, i) => (
            <div key={i} className="slot-row">
              <input type="time" className="form-input time-input" value={slot.start} onChange={(e) => updateSlot(i, 'start', e.target.value)} />
              <span className="slot-dash">→</span>
              <input type="time" className="form-input time-input" value={slot.end} onChange={(e) => updateSlot(i, 'end', e.target.value)} />
              {timeSlots.length > 1 && (
                <button type="button" className="btn-icon-sm btn-delete" onClick={() => removeSlot(i)}>×</button>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{initialSession ? 'Save Changes' : 'Create Session'}</button>
        </div>
      </form>
    </div>
  );
}

export default Sessions;
