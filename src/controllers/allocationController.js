const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { allocate, calculateMetrics } = require('../services/allocationService');

exports.runAllocation = async (req, res) => {
    try {
        const [resources] = await db.query('SELECT * FROM resources');
        const [tasks] = await db.query("SELECT * FROM tasks WHERE status = 'PENDING'");

        if (resources.length === 0) {
            return res.status(400).json({ error: 'NO_RESOURCES_IN_SYSTEM' });
        }

        if (tasks.length === 0) {
            return res.status(400).json({ error: 'NO_PENDING_TASKS' });
        }

        const result = allocate(resources, tasks);
        const metrics = calculateMetrics(resources);

        for (const allocation of result.allocations) {
            const id = uuidv4();
            await db.query(
                'INSERT INTO allocations (id, task_id, resource_id, allocated_effort) VALUES (?, ?, ?, ?)',
                [id, allocation.task_id, allocation.resource_id, 0]
            );

            await db.query(
                'UPDATE tasks SET status = ? WHERE id = ?',
                ['ALLOCATED', allocation.task_id]
            );

            await db.query(
                'UPDATE resources SET available_capacity = available_capacity - ? WHERE id = ?',
                [tasks.find(t => t.id === allocation.task_id).estimated_effort, allocation.resource_id]
            );
        }

        res.json({ ...result, metrics });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
};

exports.getAllAllocations = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                a.id,
                t.name as task_name,
                r.name as resource_name,
                t.priority,
                t.deadline,
                a.created_at
            FROM allocations a
            JOIN tasks t ON a.task_id = t.id
            JOIN resources r ON a.resource_id = r.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
};