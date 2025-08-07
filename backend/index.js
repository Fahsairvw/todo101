const express = require('express');
const mongoose = require('mongoose'); // Fixed typo: 'mangoose' -> 'mongoose'
const cors = require('cors');

const app = express();
const PORT = 15000;

// MongoDB connection URL
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/todos';

// Middleware
app.use(cors());
app.use(express.json());

// Mongoose model
const Task = mongoose.model('Task', new mongoose.Schema({
    text: String,
    completed: Boolean
}));

// Routes

// GET all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks); // Fixed: 'task' -> 'tasks'
});

// POST a new task
app.post('/tasks', async (req, res) => {
    const task = await Task.create(req.body); // Fixed: 'req-body' -> 'req.body'
    res.json(task);
});

// PUT (update) a task
app.put('/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Fixed: 'req-params.id' -> 'req.params.id'
    res.json(task);
});

// DELETE a task
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id); // Fixed: 'req-params.id' -> 'req.params.id'
    res.sendStatus(204);
});

// Connect to MongoDB and start server
const connectWithRetry = () => {
    console.log('Trying to connect to MongoDB...');
    mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Backend running on port ${PORT}`); // Fixed: $(PORT) -> ${PORT}
        });
    })
    .catch(err => {
        console.error('MongoDB connection error. Retrying in 5s...', err.message); // Fixed: console-error -> console.error
        setTimeout(connectWithRetry, 5000); // Fixed: SetTimeout -> setTimeout
    });
};

connectWithRetry();
