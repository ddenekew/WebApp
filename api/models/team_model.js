const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    club: { type: String, require: true},
    country: { type: String, require: true},
    teamImage: { type: String, required: false }
});

module.exports = mongoose.model('Team', teamSchema);