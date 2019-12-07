const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Team = require('../models/team_model');

router.get('/', (req, res, next) => {
    Team.find()
        .exec()
        .then(docs => {
            console.log(docs);
            // if (docs.length >= 0) {
                res.status(200).json(docs);
            // } else {
            //     res.status(404).json({
            //         message: 'No entries found'
            //     });
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const team = new Team({
        _id: new mongoose.Types.ObjectId(),
        club: req.body.club,
        country: req.body.country
    });
    team
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST requests to /teams',
                createdTeam: team
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
    });
});

router.get('/:teamID', (req, res, next) => {
    const id = req.params.teamID;
    Team.findById(id)
        .exec()
        .then(doc => {
            console.log("From DB:", doc);
            res.status(200).json(doc)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
            });
});

router.patch('/:teamtID', (req, res, next) => {
    const id = req.params.teamID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    team.update({ _id: id}, {$set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.delete('/:teamID', (req, res, next) => {
    const id = req.params.teamID;
    Product.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;