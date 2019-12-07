const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Player = require('../models/player_model')

router.get('/', (req, res, next) => {
    Player.find()
        .select('-__v')
        .populate('team, '-__v)
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                players: docs.map(doc => {
                    return {
                        Player: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/players/' + doc._id
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
    Team.findById(req.body.teamID)
        .then(team => {
            if (!team) {
                return res.status(404).json({
                    message: 'Team not found'
                });
            };
            const Player = new Player({
                _id: mongoose.Types.ObjectId(),
                member: req.body.member,
                team: req.body.teamID
            });
            return Player.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Player stored',
                createdPlayer: {
                    _id: result.id,
                    team: result.team,
                    member: result.qmember
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/players/' + result._id
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

router.get('/:playerID', (req, res, next) => {
    Player.findById(req.params.playerID)
        .select('-__v')
        .populate('team, '-__v)
        .exec()
        .then(Player => {
            if (!Player) {
                return res.status(404).json({
                    message: "Player not found"
                });
            }
            res.status(200).json({
                Player: Player,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/players'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:playerID', (req, res, next) => {
    Player.remove({ _id: req.params.playerID })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Player deleted',
                require: {
                    type: 'POST',
                    url: 'http://localhost:3000/players',
                    body: { teamID: "ID", member: "Strings" }
                }
            });
    });
});
module.exports = router;