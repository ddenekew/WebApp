const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Team = require('../models/team_model');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /teams'
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
            res.status(201).json({
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

router.patch('/:teamID', (req, res, next) => {
    res.status(200).json({
        message: 'Updated teams'
    });
});

router.delete('/:teamID', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted team'
    });
});


module.exports = router;