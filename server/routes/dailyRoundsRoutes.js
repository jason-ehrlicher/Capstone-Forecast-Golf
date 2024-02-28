const express = require('express');
const router = express.Router();
const dailyRoundsController = require('../controllers/dailyRoundsController');

// GET all golf rounds
// Example endpoint: http://localhost:8082/api/dailyRounds
router.get('/', dailyRoundsController.getGolfRounds);

// GET golf rounds by date
// Example endpoint: http://localhost:8082/api/dailyRounds/date/2024-02-28
router.get('/date/:date', dailyRoundsController.getGolfRoundsByDate);

// POST create a new golf round
// Example endpoint: http://localhost:8082/api/dailyRounds
router.post('/', dailyRoundsController.createGolfRounds);

// PUT update an existing golf round by ID
// Example endpoint: http://localhost:8082/api/dailyRounds/<id>
router.put('/:id', dailyRoundsController.updateGolfRounds);

// UPDATE golf rounds by date
// Example endpoint: http://localhost:8082/api/dailyRounds/date/2024-02-28
router.put('/date/:date', dailyRoundsController.updateGolfRoundsByDate);

// DELETE a golf round by ID
// Example endpoint: http://localhost:8082/api/dailyRounds/<id>
router.delete('/:id', dailyRoundsController.deleteGolfRounds);

// Delete golf rounds by date
// Example endpoint: http://localhost:8082/api/dailyRounds/date/2024-02-28
router.delete('/date/:date', dailyRoundsController.deleteGolfRoundsByDate);

module.exports = router;
