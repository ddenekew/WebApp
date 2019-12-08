const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    jersey: {type: mongoose.Schema.Types.ObjectId,
        ref: 'Jersey', reqired: true},
        quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Item', itemSchema);