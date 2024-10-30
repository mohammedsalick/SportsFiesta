const mongoose = require('mongoose');
const Score = require('../models/Score');

const calculateLeaderboard = async (eventId) => {
    try {
        const scores = await Score.aggregate([
            { $match: { event: new mongoose.Types.ObjectId(eventId) } },
            { $group: { _id: '$team', totalPoints: { $sum: '$points' } } },
            { $sort: { totalPoints: -1 } },
            { $lookup: { from: 'teams', localField: '_id', foreignField: '_id', as: 'teamDetails' } },
            { $unwind: '$teamDetails' },
            { $project: { teamName: '$teamDetails.name', totalPoints: 1 } }
        ]);
        return scores;
    } catch (error) {
        console.error('Error calculating leaderboard:', error);
        throw error;
    }
};

module.exports = calculateLeaderboard;
