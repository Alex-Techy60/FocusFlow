import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MyTasks from './pages/MyTasks';
import Categories from './pages/Categories';
import Sessions from './pages/Sessions';
import Progress from './pages/Progress';
import History from './pages/History';
import Profile from './pages/Profile';
import './App.css';

const PAGE_MAP = {
  'Dashboard':  <Dashboard />,
  'My Tasks':   <MyTasks />,
  'Categories': <Categories />,
  'Sessions':   <Sessions />,
  'Progress':   <Progress />,
  'History':    <History />,
  'Profile':    <Profile />,
};

function AppContent() {
  const { activePage } = useApp();
  return (
    <Layout>
      {PAGE_MAP[activePage] || <Dashboard />}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
