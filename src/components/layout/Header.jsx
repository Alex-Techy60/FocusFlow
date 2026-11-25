import React from 'react';
import { useApp } from '../../context/AppContext';

function Header() {
  const { profile, activePage, setSidebarOpen, setActivePage } = useApp();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = profile?.name ? profile.name.split(' ')[0] : 'there';
  const initials = profile?.name
    ? profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="header-menu-btn"
          onClick={() => setSidebarOpen((p) => !p)}
          aria-label="Toggle sidebar"
        >
          <span />
          <span />
          <span />
        </button>
        <div className="header-breadcrumb">
          <span className="header-page-name">{activePage}</span>
        </div>
      </div>

      <div className="header-right">
        <span className="header-greeting">{greeting()}, {firstName} 👋</span>
        <button
          className="header-profile-btn"
          onClick={() => setActivePage('Profile')}
          aria-label="Go to profile"
          title="Profile"
        >
          {initials}
        </button>
      </div>
    </header>
  );
}

export default Header;
