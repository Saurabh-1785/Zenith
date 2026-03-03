const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const db = require('./config/db');

db.query('SELECT 1')
    .then(() => console.log('MySQL connected!'))
    .catch((err) => console.log('DB connection failed:', err));

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Zenith Allocator is running!' });
});

const PORT = process.env.PORT || 3000;

const resourceRoutes = require('./routes/resourceRoutes');
app.use('/resources', resourceRoutes);

const taskRoutes = require('./routes/taskRoutes');
app.use('/tasks', taskRoutes);

const allocationRoutes = require('./routes/allocationRoutes');
app.use('/allocate', allocationRoutes);
app.use('/allocations', allocationRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});