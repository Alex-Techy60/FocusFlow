import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Profile.css';

const PROFESSIONS = [
  'Student', 'Software Engineer', 'Designer', 'Product Manager', 'Data Scientist',
  'Teacher', 'Entrepreneur', 'Freelancer', 'Doctor', 'Lawyer', 'Writer', 'Other'
];

function Profile() {
  const { profile, updateProfile, masterTasks, getProgressData } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const data = getProgressData();
  const totalDays = data.length;
  const avgPct = totalDays ? Math.round(data.reduce((s, d) => s + d.pct, 0) / totalDays) : 0;
  const totalCompleted = data.reduce((s, d) => s + d.completed, 0);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const initials = profile.name
    ? profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Your personal details and account overview</p>
        </div>
      </div>

      <div className="profile-layout">
        {/* Avatar + Stats card */}
        <div className="profile-card">
          <div className="profile-avatar">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="avatar-img" />
            ) : (
              <div className="avatar-initials">{initials}</div>
            )}
          </div>

          <div className="profile-name-area">
            <h2 className="profile-display-name">
              {profile.name || 'Your Name'}
            </h2>
            {profile.profession && (
              <span className="profile-profession">{profile.profession}</span>
            )}
            {profile.email && (
              <span className="profile-email">✉ {profile.email}</span>
            )}
            {profile.bio && (
              <p className="profile-bio">{profile.bio}</p>
            )}
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-value">{masterTasks.length}</span>
              <span className="profile-stat-label">Total Tasks</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">{totalCompleted}</span>
              <span className="profile-stat-label">Completed</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">{totalDays}</span>
              <span className="profile-stat-label">Days Active</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">{avgPct}%</span>
              <span className="profile-stat-label">Avg Rate</span>
            </div>
          </div>

          {!editing && (
            <button className="btn-primary profile-edit-btn" onClick={() => { setForm({ ...profile }); setEditing(true); }}>
              Edit Profile
            </button>
          )}

          {saved && (
            <div className="save-success">✓ Profile saved successfully!</div>
          )}
        </div>

        {/* Form */}
        <div className="profile-form-panel">
          {!editing ? (
            <div className="profile-info-view">
              <h3 className="form-section-title">Personal Information</h3>
              <div className="info-grid">
                <InfoRow label="Full Name" value={profile.name} />
                <InfoRow label="Age" value={profile.age} />
                <InfoRow label="Profession" value={profile.profession} />
                <InfoRow label="Email" value={profile.email} />
                <InfoRow label="Bio" value={profile.bio} fullWidth />
              </div>

              {!profile.name && (
                <div className="profile-setup-banner">
                  <span>👋</span>
                  <div>
                    <strong>Set up your profile</strong>
                    <p>Add your details to personalize your FocusFlow experience.</p>
                  </div>
                  <button className="btn-primary" onClick={() => setEditing(true)}>
                    Get Started
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSave} className="profile-form" noValidate>
              <h3 className="form-section-title">Edit Profile</h3>

              <div className="profile-form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    className="form-input"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Alex Johnson"
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    className="form-input"
                    type="number"
                    min="1"
                    max="120"
                    value={form.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="25"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="alex@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Profession</label>
                  <select
                    className="form-input"
                    value={form.profession}
                    onChange={(e) => handleChange('profession', e.target.value)}
                  >
                    <option value="">Select profession…</option>
                    {PROFESSIONS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>

                <div className="form-group form-group-full">
                  <label>Bio / About Me</label>
                  <textarea
                    className="form-input form-textarea"
                    value={form.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="A short note about yourself, your goals, or how you use FocusFlow…"
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => { setEditing(false); setForm({ ...profile }); }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">Save Profile</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, fullWidth }) {
  return (
    <div className={`info-row ${fullWidth ? 'info-row-full' : ''}`}>
      <span className="info-label">{label}</span>
      <span className="info-value">{value || <span className="info-empty">Not set</span>}</span>
    </div>
  );
}

export default Profile;
