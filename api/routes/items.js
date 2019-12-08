const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const item = require('../models/item_model')
const Jersey = require('../models/jersey_model');

router.get('/', (req, res, next) => {
    item.find()
        .select('-__v')
        .populate('jersey', '-__v')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                items: docs.map(doc => {
                    return {
                        item: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/items/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});
router.post('/', (req, res, next) => {
    Jersey.findById(req.body.jerseyID)
        .then(jersey => {
            if (!jersey) {
                return res.status(404).json({
                    message: 'Jersey not found'
                });
            };
            const item = new Item({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                jersey: req.body.jerseyID
            });
            return item.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Item stored',
                createdItem: {
                    _id: result.id,
                    jersey: result.jersey,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/items/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:itemID', (req, res, next) => {
    Item.findById(req.params.itemID)
        .select('-__v')
        .populate('jersey', '-__v')
        .exec()
        .then(item => {
            if (!item) {
                return res.status(404).json({
                    message: "Item not found"
                });
            }
            res.status(200).json({
                item: item,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/items'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:itemID', (req, res, next) => {
    Item.remove({ _id: req.params.itemID })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Item deleted',
                require: {
                    type: 'POST',
                    url: 'http://localhost:3000/items',
                    body: { jerseyID: "ID", quantity: "Number" }
                }
            });
    });
});
module.exports = router;