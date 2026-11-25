import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import TaskForm from './TaskForm';
import editIcon from '../../assets/edit-button.svg';
import deleteIcon from '../../assets/delete-button.svg';

function TaskItem ({ task }) {
    const { toggleTask, deleteTask } = useTask();
    const [isEditing, setIsEditing] = useState(false);
    const priority = task.priority || 'Medium';
    
    if(isEditing) {
        return (
            <TaskForm 
                initialTask={task}
                onClose={() => setIsEditing(false)}
            />
        );
    }

    return (
        <div className={`task-item ${task.completed ? 'task-completed' : ''}`}>
            <div className='task-item-main-area'>
                <div className='task-left'>
                    <input 
                        type='checkbox'
                        id={`toggle-task-${task.id}`}
                        className={`toggle-checkbox`}
                        checked={Boolean(task.completed)}
                        onChange={() => toggleTask(task.id)}
                    />
                    <label 
                        htmlFor={`toggle-task-${task.id}`}
                        className='task-title'
                    >
                        {task.title}
                    </label>
                </div>
                
                <div className='task-actions'>
                    <button
                        type='button'
                        className='icon-button update-task-button'
                        onClick={() => setIsEditing(true)}
                        aria-label='Edit Task'
                        title='Edit Task'
                    >
                        <img src={editIcon} alt='edit' className='action-icon' />
                    </button>

                    <button
                        type='button'
                        className='icon-button delete-task-button'
                        onClick={() => deleteTask(task.id)}
                        aria-label='Delete Task'
                        title='Delete Task'
                    >
                        <img src={deleteIcon} alt='delete' className='action-icon' />
                    </button>
                </div>
            </div>
            {task.description && (
                <p className='task-description'>{task.description}</p>
            )}

            <div className='task-item-footer'>
                <span className='task-badge task-category'>
                    {task.category || 'General'}
                </span>

                <span className={`task-badge task-priority task-priority-${priority.toLowerCase()}`}>
                    {priority}
                </span>

                {task.date && (
                    <span className='task-date'>{task.date}</span>
                )}
            </div>
        </div>
    )
}

export default TaskItem;