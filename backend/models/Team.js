const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    scores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Score' }]
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
