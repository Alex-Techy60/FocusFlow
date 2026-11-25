import React, { useState } from "react";
import TaskList from "./TaskList";
import './Task.css';

function TaskSection({ tasks=[] }) {

    const [status, setStatus] = useState('pending');

    const pendingTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);
    const allTasks = tasks;
    const pendingCount = pendingTasks.length;
    const completedCount = completedTasks.length;
    const allCount = allTasks.length;

    const filteredTasks = (status === 'pending' ? pendingTasks : status === 'completed' ? completedTasks : allTasks);

    const tabs = [
        { id: 'pending', label: 'Pending', count: pendingCount },
        { id: 'completed', label: 'Completed', count: completedCount },
        { id: 'all', label: 'All Tasks', count: allCount }
    ];

    return (
        <section className="task-section">
            <div className="task-section-header">
                <div className="task-tabs" role="tablist" aria-label="Task status filter">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={status === tab.id}
                            className={`task-tab ${status === tab.id ? 'active' : ''}`}
                            onClick={() => setStatus(tab.id)}
                        >
                            <span>{tab.label}</span>
                            <span className="task-tab-count">{tab.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            <TaskList tasks={filteredTasks} />
        </section>
    )
}

export default TaskSection;