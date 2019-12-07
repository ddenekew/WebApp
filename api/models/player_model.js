const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    team: {type: mongoose.Schema.Types.ObjectId,
        ref: 'Team', reqired: true},
    member: { type: String, reqired: true}
});

module.exports = mongoose.model('Player', playerSchema);