const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createTask = async (req, res) => {
    try {
        const { name, required_skills, estimated_effort, minimum_capacity_needed, priority, deadline } = req.body;

        if (!name || !required_skills || !estimated_effort || !minimum_capacity_needed || !priority) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const id = uuidv4();
        await db.query(
            'INSERT INTO tasks (id, name, required_skills, estimated_effort, minimum_capacity_needed, priority, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, name, JSON.stringify(required_skills), estimated_effort, minimum_capacity_needed, priority, deadline]
        );

        res.json({ message: 'Task created!', id });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tasks');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
};