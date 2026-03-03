const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocationController');

router.post('/', allocationController.runAllocation);
router.get('/', allocationController.getAllAllocations);

module.exports = router;