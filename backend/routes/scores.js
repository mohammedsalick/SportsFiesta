const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Submit Score (Judge Only)
router.post('/', auth(['judge']), async (req, res) => {
    const { eventId, teamId, points } = req.body;
    try {
        console.log('Received score submission:', { eventId, teamId, points });
        
        const score = new Score({
            event: new mongoose.Types.ObjectId(eventId),
            team: new mongoose.Types.ObjectId(teamId),
            judge: new mongoose.Types.ObjectId(req.user.id),
            points: Number(points),
        });
        console.log('Created score object:', score);
        
        await score.save();
        console.log('Score saved successfully');
        
        // Calculate and emit updated leaderboard
        const leaderboard = await calculateLeaderboard(eventId);
        console.log('Calculated leaderboard:', leaderboard);
        
        if (req.io) {
            req.io.emit('updateLeaderboard', { eventId, leaderboard });
        } else {
            console.warn('Socket.io not available on request object');
        }
        
        res.json(score);
    } catch (err) {
        console.error('Error in score submission:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: 'Validation Error', errors: err.errors });
        }
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Get Scores for an Event
router.get('/:eventId', auth(['admin', 'leader', 'judge']), async (req, res) => {
    try {
        const scores = await Score.find({ event: req.params.eventId }).populate('judge', 'name');
        res.json(scores);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Leaderboard for an Event
router.get('/leaderboard/:eventId', async (req, res) => {
    try {
        const leaderboard = await calculateLeaderboard(req.params.eventId);
        res.json(leaderboard);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Helper function to calculate leaderboard
async function calculateLeaderboard(eventId) {
    try {
        const leaderboard = await Score.aggregate([
            { $match: { event: new mongoose.Types.ObjectId(eventId) } },
            { $group: { _id: "$team", totalPoints: { $sum: "$points" } } },
            { $sort: { totalPoints: -1 } },
            { $lookup: { from: 'teams', localField: '_id', foreignField: '_id', as: 'teamDetails' } },
            { $unwind: '$teamDetails' },
            { $project: { team: "$_id", teamName: '$teamDetails.name', totalPoints: 1, _id: 0 } }
        ]);
        return leaderboard;
    } catch (error) {
        console.error('Error calculating leaderboard:', error);
        throw error;
    }
}

module.exports = router;
