const express = require('express');
const router = express.Router();
const dailyRoundsController = require('../controllers/dailyRoundsController');

// GET all golf rounds
// Example endpoint: http://localhost:8082/api/dailyRounds
router.get('/', dailyRoundsController.getGolfRounds);

// POST create a new golf round
// Example endpoint: http://localhost:8082/api/dailyRounds
router.post('/', dailyRoundsController.createGolfRounds);

// PUT update an existing golf round by ID
// Example endpoint: http://localhost:8082/api/dailyRounds/<id>
router.put('/:id', dailyRoundsController.updateGolfRounds);

// DELETE a golf round by ID
// Example endpoint: http://localhost:8082/api/dailyRounds/<id>
router.delete('/:id', dailyRoundsController.deleteGolfRounds);

module.exports = router;
