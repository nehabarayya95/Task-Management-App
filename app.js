document.getElementById('task-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const taskInput = document.getElementById('task-input');
    const assigneeInput = document.getElementById('assignee-input');
    const taskTitle = taskInput.value.trim();
    const assignee = assigneeInput.value.trim();
    if (!taskTitle || !assignee) return;

    try {
        const response = await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: taskTitle, assignee: assignee })
        });

        if (!response.ok) {
            throw new Error('Failed to add task');
        }

        const task = await response.json();
        addTaskToList(task);
        taskInput.value = '';
        assigneeInput.value = '';
    } catch (error) {
        console.error(error.message);
    }
});

function addTaskToList(task) {
    const taskList = document.getElementById('task-list');

     // Create li element for the task
    // const listItem = document.createElement('li');
    // listItem.textContent = task.title;
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span>${task.title} - Assigned to: ${task.assignee}</span>`;

    // Create button element for the delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';

    // Add space between task text and delete button
    deleteButton.style.marginLeft = "10px"; // Adjust as needed
    deleteButton.addEventListener('click', async () => {
        try {
            const deleteResponse = await fetch(`http://localhost:3000/tasks/${task._id}`, { method: 'DELETE' });
            if (!deleteResponse.ok) {
                throw new Error('Failed to delete task');
            }
            listItem.remove();
        } catch (error) {
            console.error(error.message);
        }
    });

    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
}

// Fetch tasks on page load
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3000/tasks');
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const tasks = await response.json();
        tasks.forEach(task => addTaskToList(task));
    } catch (error) {
        console.error(error.message);
    }
});