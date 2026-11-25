import React from 'react';

function Header() {
    return (
        <header className='header'>
            <div className='brand-name-div'>
                <span className='brand-name-span'>FocusFlow</span>
                <span className='brand-name-span'>Plan your day</span>
            </div>
            <div className='greeting-message'>
                Hey Alex
            </div>
            <div className='user-profile-placeholder' aria-label='user-profile-placeholder'>Profile</div>
        </header>
    )
}

export default Header;