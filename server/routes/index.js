'use strict';

const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');

/**
 * Database connection.
 */
mongoose.connect(`mongodb://${config.DatabaseUser}:${config.DatabasePassword}@${config.DatabaseEndpoint}`, {
  useNewUrlParser: true,
  useCreateIndex: true
});

// routes
const usersRouter = require('./users');

// REST API
const apiRouter = express.Router();

apiRouter

  // bind routes to handlers
  .get('/', (_, res) => res.send('API is up and running!'))
  .use('/user', usersRouter);

 module.exports = apiRouter;
