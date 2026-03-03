const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createResource = async (req, res) => {
    try {
        const { name, skills, total_capacity } = req.body;

        if (!name || !skills || !total_capacity) {
            return res.status(400).json({ error: 'name, skills and total_capacity are required' });
        }

        const id = uuidv4();
        await db.query(
            'INSERT INTO resources (id, name, skills, total_capacity, available_capacity) VALUES (?, ?, ?, ?, ?)',
            [id, name, JSON.stringify(skills), total_capacity, total_capacity]
        );

        res.json({ message: 'Resource created!', id });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
};

exports.getAllResources = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM resources');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
};