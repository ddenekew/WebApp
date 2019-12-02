const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Players were fetched'
    });
});

router.post('/', (req, res, next) => {
    const Player = {
        teamID: req.body.teamID,
        member: req.body.member
    };
    res.status(201).json({
        message: 'Handling POST request to /players',
        createdPlayer: Player
    });
});

router.get('/:playerID', (req, res, next) => {
    res.status(200).json({
        message: 'Player details',
        playerID: req.params.playerID
    });
});

router.delete('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'Player deleted',
        playerID: req.params.playerID
    });
});


module.exports = router;