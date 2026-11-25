import { createContext, useContext, useState } from "react";

const TaskContext = createContext(null);

const useTask = () => {
    const context = useContext(TaskContext);

    if(!context) {
        throw new Error("useTask must be used within TaskProvider");
    }

    return context;
}

function TaskProvider( {children} ) {

    const [tasks, setTasks] = useState([]);

    const addTask = (task) => {
        setTasks((prev) => [{ id: crypto.randomUUID, ...task }, ...prev]);
    }

    const deleteTask = (id) => {
        setTasks((prev) => (prev.filter((task) => task.id !== id)));
    }

    const updateTask = (id, newTask) => {
        setTasks((prev) => (prev.map((task) => ((task.id === id) ? ({ ...task, ...newTask }) : (task)))));
    }

    const toggleTask = (id) => {
        setTasks((prev) => (prev.map((task) => (task.id === id) ? ({...task, completed: !task.completed}) : (task))));
    }

    return (
        <TaskContext.Provider
            value={{tasks, addTask, deleteTask, updateTask, toggleTask}}
        >
            {children}
        </TaskContext.Provider>
    )
}

export { useTask, TaskProvider };