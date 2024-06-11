const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

// Allow requests from all origins
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/taskdb', {
}).then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

const Task = mongoose.model('Task', {
    title: String,
    assignee: String
});

// Route handler for creating a new task
app.post('/tasks', async (req, res) => {
    try {
        const task = new Task({
            title: req.body.title,
            assignee: req.body.assignee
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});