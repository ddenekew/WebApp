const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    club: String,
    country: String
});

module.exports = mongoose.model('Team', teamSchema);