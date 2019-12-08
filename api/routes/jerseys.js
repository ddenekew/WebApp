const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Jersey = require('../models/jersey_model');
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
    Jersey.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                jerseys: docs.map(doc => {
                    return {
                        jersey: doc,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/jerseys/" + doc._id
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

router.post('/', upload.single('jerseyImage'), (req, res, next) => {
    console.log(req.file);
    const jersey = new Jersey({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        jerseyImage: req.file.path
    });
    jersey
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created jersey successfully',
                createdJersey: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    super_lable: result.jerseyImage
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/jerseys/" + result._id
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

router.get('/:jerseyID', (req, res, next) => {
    const id = req.params.jerseyID;
    Jersey.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            res.status(200).json({
                jersey: doc,
                request: {
                    type: 'GET',
                    description: 'Get all jerseys',
                    url: 'http://localhost:3000/jerseys'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
            });
});

router.patch('/:jerseyID', (req, res, next) => {
    const id = req.params.jerseyID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    jersey.update({ _id: id}, {$set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Jersey updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/jerseys/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.delete('/:jerseyID', (req, res, next) => {
    const id = req.params.jerseyID;
    Jersey.deleteOne({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Jersey deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/jerseys',
                    body: { name: 'String', price: 'Number' }
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