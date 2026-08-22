const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'tasks.json');

function readTasks() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function writeTasks(tasks) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// API
app.get('/api/tasks', (req, res) => {
    res.json(readTasks());
});

app.post('/api/tasks', (req, res) => {
    const { text } = req.body;
    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Vui lòng nhập nội dung' });
    }
    const tasks = readTasks();
    const newTask = {
        id: Date.now(),
        text: text.trim(),
        completed: false
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tasks = readTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Không tìm thấy' });
    }
    task.completed = !task.completed;
    writeTasks(tasks);
    res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let tasks = readTasks();
    tasks = tasks.filter(t => t.id !== id);
    writeTasks(tasks);
    res.json({ message: 'Xóa thành công' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
});