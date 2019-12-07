const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Team = require('../models/team_model');
const multer = require('multer');

const myStorage = multer.diskStorage( {
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const myFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        // save the image
        cb(null, true);
    } else {
        // reject the image
        cb(null, false);
    }
};

const upload = multer({
    storage: myStorage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: myFilter
});

router.get('/', (req, res, next) => {
    Team.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                teams: docs.map(doc => {
                    return {
                        team: doc,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/teams/" + doc._id
                        }
                    }
                })
            }
                res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', upload.single('teamImage'), (req, res, next) => {
    console.log(req.file);
    const team = new Team({
        _id: new mongoose.Types.ObjectId(),
        club: req.body.club,
        country: req.body.country,
        teamImage: req.file.path
    });
    team
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created team successfully',
                createdTeam: {
                    club: result.club,
                    country: result.country,
                    _id: result._id,
                    crazy_lable: result.teamImage
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/teams/" + result._id
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

router.get('/:teamID', (req, res, next) => {
    const id = req.params.teamID;
    Team.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            res.status(200).json({
                team: doc,
                request: {
                    type: 'GET',
                    description: 'Get all teams',
                    url: 'http://localhost:3000/teams'
                }
            });
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
            res.status(200).json({
                message: 'Team updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/teams/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.delete('/:teamID', (req, res, next) => {
    const id = req.params.teamID;
    team.deleteOne({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Team deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/teams',
                    body: { club: 'String', country: 'String' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;