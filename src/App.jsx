import React from 'react'
import { TaskProvider } from './context/TaskContext';
import './App.css';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <TaskProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </TaskProvider>
  )
}

export default App