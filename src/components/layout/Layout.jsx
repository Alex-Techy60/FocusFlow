import React from 'react';
import { useApp } from '../../context/AppContext';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout({ children }) {
  const { sidebarOpen } = useApp();

  return (
    <div className={`app-layout ${sidebarOpen ? 'layout-sidebar-open' : 'layout-sidebar-collapsed'}`}>
      <Sidebar />
      <div className="layout-body">
        <Header />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
