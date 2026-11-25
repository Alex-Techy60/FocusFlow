import React from 'react';

const navItems = ["Dashboard", "My Tasks", "Categories", "Sessions", "Progress", "History"]

function Sidebar() {
    return (
        <aside className='sidebar'>
            <nav aria-label='navigation'>
                <ul className='sidebar-list'>
                    {navItems.map((item) => (
                        <li key={item} className='sidebar-item'>
                            {item}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar;