import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks }) {

    if (tasks.length === 0) {
        return (
            <div className='task-list-empty'>
                No tasks in this section yet
            </div>
        );
    }

    return (
        <ul className='task-list'>
            {tasks.map(task => (
                <li key={task.id}>
                    <TaskItem task={task} />
                </li>
            ))}
        </ul>
    );
}

export default TaskList;