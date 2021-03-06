const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const jerseyRoutes = require('./api/routes/jerseys');
const itemRoutes = require('./api/routes/items');

mongoose.connect('mongodb+srv://DanielD:' + process.env.MONGO_ATLAS_PW +
    '@cluster0-6wwly.mongodb.net/test?retryWrites=true&w=majority',
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next(); 
});

app.use(express.static(__dirname));
console.log("This is the directory listed in __dirname " + __dirname);
app.use('/styles', express.static(__dirname));
app.use('/image', express.static(__dirname + '/images'));
app.use('/scripts', express.static(__dirname + '/scripts'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});

 // Routers which should handle requests
app.use('./jerseys', jerseyRoutes);
app.use('./items', itemRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status(404);
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;