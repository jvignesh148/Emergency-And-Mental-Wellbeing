import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/TaskDashboard.css';

const TaskDashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState({ HIGH: [], MEDIUM: [], LOW: [] });
    const [newTask, setNewTask] = useState({
        title: '',
        priority: 'HIGH',
        dueDate: '',
        reminderTime: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const userId = localStorage.getItem('userId'); // From login

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }
        fetchTasks();
    }, [userId, navigate]);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/user/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                const groupedTasks = {
                    HIGH: data.filter(task => task.priority === 'HIGH'),
                    MEDIUM: data.filter(task => task.priority === 'MEDIUM'),
                    LOW: data.filter(task => task.priority === 'LOW'),
                };
                setTasks(groupedTasks);
            } else {
                setError('Failed to fetch tasks');
            }
        } catch (err) {
            setError('Error fetching tasks: ' + err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            // Validate inputs
            if (!userId) {
                alert("User ID is missing. Please log in again.");
            }
            if (!newTask.title) {
                alert("Task title is required.");
            }
            if (!newTask.dueDate) {
                alert("Due date is required.");
            }
            if (!newTask.priority) {
                alert("Priority is required.");
            }
    
            // Format dueDate and reminderTime to ISO 8601
            const dueDate = new Date(newTask.dueDate);
            if (isNaN(dueDate)) {
                throw new Error("Invalid due date format.");
            }
            const formattedDueDate = dueDate.toISOString().split('.')[0];
    
            let formattedReminderTime = null;
            if (newTask.reminderTime) {
                const reminderTime = new Date(newTask.reminderTime);
                if (isNaN(reminderTime)) {
                    throw new Error("Invalid reminder time format.");
                }
                formattedReminderTime = reminderTime.toISOString().split('.')[0];
            }
    
            const taskData = {
                userId,
                title: newTask.title,
                dueDate: formattedDueDate,
                priority: newTask.priority,
                reminderTime: formattedReminderTime,
                completed: false,
            };
            console.log("Sending POST request with body:", JSON.stringify(taskData));
            const response = await fetch('http://localhost:8080/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(taskData),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to add task: ${response.status} ${errorText}`);
            }
            const result = await response.json();
            alert(result.message);
            setNewTask({ title: '', priority: 'HIGH', dueDate: '', reminderTime: '' });
            fetchTasks();
        } catch (err) {
            alert('Error adding task: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setNewTask({
            title: task.title,
            priority: task.priority,
            dueDate: task.dueDate.split('T')[0],
            reminderTime: task.reminderTime ? task.reminderTime.split('T')[0] : '',
        });
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            // Validate inputs
            if (!newTask.title) {
                alert("Task title is required.");
            }
            if (!newTask.dueDate) {
                alert("Due date is required.");
            }
            if (!newTask.priority) {
                alert("Priority is required.");
            }
    
            // Format dueDate and reminderTime to ISO 8601
            const dueDate = new Date(newTask.dueDate);
            if (isNaN(dueDate)) {
                throw new Error("Invalid due date format.");
            }
            const formattedDueDate = dueDate.toISOString().split('.')[0];
    
            let formattedReminderTime = null;
            if (newTask.reminderTime) {
                const reminderTime = new Date(newTask.reminderTime);
                if (isNaN(reminderTime)) {
                    throw new Error("Invalid reminder time format.");
                }
                formattedReminderTime = reminderTime.toISOString().split('.')[0];
            }
    
            const taskData = {
                title: newTask.title,
                dueDate: formattedDueDate,
                priority: newTask.priority,
                reminderTime: formattedReminderTime,
                completed: editingTask.completed,
            };
            console.log("Sending PUT request with body:", JSON.stringify(taskData));
            const response = await fetch(`http://localhost:8080/api/tasks/${editingTask.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(taskData),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update task: ${response.status} ${errorText}`);
            }
            const result = await response.json();
            alert(result.message);
            setEditingTask(null);
            setNewTask({ title: '', priority: 'HIGH', dueDate: '', reminderTime: '' });
            fetchTasks();
        } catch (err) {
            setError('Error updating task: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                fetchTasks();
            } else {
                setError(result.message || 'Failed to delete task');
            }
        } catch (err) {
            setError('Error deleting task: ' + err.message);
        }
    };

    return (
        <div className="task-dashboard">
            <header>  
            <nav>
                <ul>
                    <li id='topic'>ZenAlert</li>
                    <li><a href='/home'>Home</a></li>
                    <li><a href='/sos'>SOS Help</a></li>
                    <li><a href='/assessment'>Assessment</a></li>
                    <li><a href='/chatbot'>Chatbot</a></li>
                    <li><a href='/videos'>videos</a></li>
                    <li><a href='/mood-track'>Mood Track</a></li>
                    <li><a href='/news-api'>News API</a></li>
                    <li><a href='/task-management'>Task Management</a></li>
                </ul>
            </nav>
        </header>
            <h1>Task Dashboard</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="task-input">
                <input
                    type="text"
                    name="title"
                    placeholder="Enter task"
                    value={newTask.title}
                    onChange={handleInputChange}
                    required
                />
                <select name="priority" value={newTask.priority} onChange={handleInputChange}>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                </select>
                <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="datetime-local"
                    name="reminderTime"
                    value={newTask.reminderTime}
                    onChange={handleInputChange}
                />
                <button onClick={editingTask ? handleUpdateTask : handleAddTask} disabled={isLoading}>
                    {isLoading ? 'Processing...' : editingTask ? 'Update Task' : 'Add Task'}
                </button>
            </div>
            <div className="task-sections">
                <div className="task-column">
                    <h2>High Priority Tasks</h2>
                    {tasks.HIGH.map(task => (
                        <div key={task.id} className="task-card">
                            <p><strong>Title:</strong> {task.title}</p>
                            <p><strong>Due:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC' : 'None'}</p>
                            <p><strong>Reminder:</strong> {task.reminderTime ? new Date(task.reminderTime).toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC' : 'None'}</p>
                            <button onClick={() => handleEditTask(task)}>Edit</button>
                            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                        </div>
                    ))}
                </div>
                <div className="task-column">
                    <h2>Medium Priority Tasks</h2>
                    {tasks.MEDIUM.map(task => (
                        <div key={task.id} className="task-card">
                            <p>{task.title}</p>
                            <p><strong>Due:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC' : 'None'}</p>
                            <p><strong>Reminder:</strong> {task.reminderTime ? new Date(task.reminderTime).toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC' : 'None'}</p>
                            <button onClick={() => handleEditTask(task)}>Edit</button>
                            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                        </div>
                    ))}
                </div>
                <div className="task-column">
                    <h2>Low Priority Tasks</h2>
                    {tasks.LOW.map(task => (
                        <div key={task.id} className="task-card">
                            <p>{task.title}</p>
                            <p><strong>Due:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC' : 'None'}</p>
                            <p><strong>Reminder:</strong> {task.reminderTime ? new Date(task.reminderTime).toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC' : 'None'}</p>
                            <button onClick={() => handleEditTask(task)}>Edit</button>
                            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskDashboard;
