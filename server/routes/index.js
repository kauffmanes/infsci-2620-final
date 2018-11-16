'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Config = require('../config');

/**
 * Database connection.
 */
mongoose.connect(`mongodb://${Config.DatabaseUser}:${Config.DatabasePassword}@${Config.DatabaseEndpoint}`, {
  useNewUrlParser: true,
  useCreateIndex: true
});

// routes
const usersRouter = require('./users');
const titlesRouter = require('./titles');
const flagsRouter = require('./flags');
const accessLevelsRouter = require('./accessLevels');

// REST API
const apiRouter = express.Router();

apiRouter

  // bind routes to handlers
  .get('/', (_, res) => res.send('API is up and running!'))
  .use('/users', usersRouter)
  .use('/titles', titlesRouter)
  .use('/access', accessLevelsRouter)
  .use('/flags', flagsRouter);

 module.exports = apiRouter;
