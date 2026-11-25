import React from 'react'
import './ProgressBar.css';

function ProgressBar({ total = 0, completed = 0 }) {
    
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    const remaining = Math.max((total - completed), 0);

    const size = 120;
    const strokeWidth = 10;
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-card">
        <div className="progress-ring-wrapper">
            <svg 
                className='progress-ring'
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                role='img'
                aria-label={`Task completion: ${percentage}%`}
            >
                <circle 
                    className='progress-ring-track'
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                />

                <circle 
                    className='progress-ring-fill'
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </svg>

            <div className="progress-ring-center">
                <span className='progress-percentage'>{percentage}%</span>
                <span className='progress-subtext'>Done</span>
            </div>
        </div>

        <div className="progress-details">
            <h3 className='progress-title'>Tasks Progress</h3>
            <p className='progress-summary'>
                {total === 0
                    ? 'No tasks added yet'
                    : `${completed} of ${total} tasks completed`}
            </p>
            <div className="progress-stats-row">
                <div className="progress-stat">
                    <span className='progress-stat-dot dot-completed'></span>
                    <span>Completed: <strong>{completed}</strong></span>
                </div>
                <div className='progress-stat'>
                    <span className='progress-stat-dot dot-remaining'></span>
                    <span>Remaining: <strong>{remaining}</strong></span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProgressBar