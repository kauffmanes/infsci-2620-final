// require nodejs packages
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000; // if you change this, change it in package.json in client
const bodyParser = require('body-parser');
const morgan = require('morgan');

// database
// const models = require('./models');

// API/routing
const apiRouter = require('./routes');

/**
 * Here I am specifying origin, allowed methods, and headers.
 * We can include this in the final report and talk about how
 * we handled CORS.
 * 
 * Also talk about middleware and how each request passes through this.
 */
app.use((_, res, next) => {
    // only localhost can hit the API
    res.setHeader('Access-Controll-Allow-Origin', 'localhost');
    res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

/**
 * This disables the ability for attackers to know that we're using Express as our
 * framework, so that they don't perform Express-specific attacks.
 */
app.disable('x-powered-by');

/**
 * I have logging set to dev as the default currently, but we can change this
 * so that it's better for production if we end of deploying this as part of the class.
 */
app.use(morgan('dev'));

/**
 * Handles application/json content type
 */
app.use(bodyParser.json());

app.use('/api', apiRouter);

if (process.env.NODE_ENV === 'production') {

    /**
     * Handles requests for static files. In this case, I'm just saying 
     * refer these requests to the client frontend.
     * 
     * It assumes that the frontend compiled code has been outputted to a folder
     * named "dist". Depending how the frontend (if we use React, specific structure, etc)
     * this will change.
     */
    app.use(express.static(path.join(__dirname, 'client/build')));

    /**
     * If the incoming request doesn't match the api path (/api), 
     * load the frontend index.html page and let frontend handle it.
     */
    // app.get('*', (req, res) => {
    //     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    // });
    app.get('/', function (req, res) {
        res.send('hello');
    });
}

app.listen(port, err => {
    if (err) return console.error(err);
    console.log(`HTTP server listening on port ${port}.`);
});
