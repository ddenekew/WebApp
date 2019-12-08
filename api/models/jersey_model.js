const mongoose = require('mongoose');

const jerseySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    price: { type: Number, required: true},
    jerseyImage: { type: String, required: false }
});

module.exports = mongoose.model('Jersey', jerseySchema);