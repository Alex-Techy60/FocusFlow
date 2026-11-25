import React from 'react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { id: 'Dashboard',  icon: '🏠', label: 'Dashboard' },
  { id: 'My Tasks',   icon: '✅', label: 'My Tasks' },
  { id: 'Categories', icon: '🏷️', label: 'Categories' },
  { id: 'Sessions',   icon: '⏱️', label: 'Sessions' },
  { id: 'Progress',   icon: '📊', label: 'Progress' },
  { id: 'History',    icon: '🗂️', label: 'History' },
];

function Sidebar() {
  const { activePage, setActivePage, sidebarOpen, setSidebarOpen, profile } = useApp();

  const initials = profile?.name
    ? profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          {sidebarOpen && (
            <div className="sidebar-brand-text">
              <span className="sidebar-logo-text">FocusFlow</span>
              <span className="sidebar-logo-sub">Plan · Focus · Achieve</span>
            </div>
          )}
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen((p) => !p)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? '‹' : '›'}
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav" aria-label="Main navigation">
          <ul className="sidebar-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  className={`sidebar-item ${activePage === item.id ? 'sidebar-item-active' : ''}`}
                  onClick={() => setActivePage(item.id)}
                  title={!sidebarOpen ? item.label : undefined}
                  aria-current={activePage === item.id ? 'page' : undefined}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  {sidebarOpen && <span className="sidebar-item-label">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Profile shortcut at bottom */}
        <div className="sidebar-footer">
          <button
            className={`sidebar-profile-btn ${activePage === 'Profile' ? 'sidebar-item-active' : ''}`}
            onClick={() => setActivePage('Profile')}
            title={!sidebarOpen ? 'Profile' : undefined}
          >
            <div className="sidebar-avatar">{initials}</div>
            {sidebarOpen && (
              <div className="sidebar-profile-info">
                <span className="sidebar-profile-name">{profile?.name || 'Set up profile'}</span>
                <span className="sidebar-profile-role">{profile?.profession || 'User'}</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
