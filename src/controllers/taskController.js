const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createTask = async (req, res) => {
    const { name, required_skills, estimated_effort, minimum_capacity_needed, priority, deadline } = req.body;
    const id = uuidv4();

    await db.query(
        'INSERT INTO tasks (id, name, required_skills, estimated_effort, minimum_capacity_needed, priority, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, name, JSON.stringify(required_skills), estimated_effort, minimum_capacity_needed, priority, deadline]
    );

    res.json({ message: 'Task created!', id });
};

exports.getAllTasks = async (req, res) => {
    const [rows] = await db.query('SELECT * FROM tasks');
    res.json(rows);
};