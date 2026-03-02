const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createResource = async (req, res) => {
    const { name, skills, total_capacity } = req.body;
    const id = uuidv4();

    await db.query(
        'INSERT INTO resources (id, name, skills, total_capacity, available_capacity) VALUES (?, ?, ?, ?, ?)',
        [id, name, JSON.stringify(skills), total_capacity, total_capacity]
    );

    res.json({ message: 'Resource created!', id });
};

exports.getAllResources = async (req, res) => {
    const [rows] = await db.query('SELECT * FROM resources');
    res.json(rows);
};