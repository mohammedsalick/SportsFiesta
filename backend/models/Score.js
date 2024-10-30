const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    points: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Score', ScoreSchema);
