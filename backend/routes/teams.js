const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const auth = require('../middleware/auth');

// Register Team
router.post('/', auth(['participant']), async (req, res) => {
    const { name, eventId } = req.body;
    try {
        const team = new Team({
            name,
            event: eventId,
            leader: req.user.id,
        });
        await team.save();
        res.json(team);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Teams for an Event
router.get('/', auth(['admin', 'judge']), async (req, res) => {
    const { eventId } = req.query;
    try {
        const teams = await Team.find({ event: eventId });
        res.json(teams);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;