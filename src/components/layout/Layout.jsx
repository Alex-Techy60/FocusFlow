import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout({ children }) {
    return (
        <div className='app-layout'>
            <Sidebar />

            <div className='layout-body'>
                <Header />
                <main className='main-content'>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout;