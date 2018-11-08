'use strict';

const express = require('express');

// routers go here
/**
 * Each router goes here. For example:
 * const usersRouter = require('./users);
 * 
 * This would handle all API calls relating to users.
 */

// creates a new router to handle all API calls
const apiRouter = express.Router();

apiRouter.get('/', (_, res) => res.send('API is up and running!'));

/**
 * To add to this:
 * 
 * example:
 * apiRouter.use('/users', usersRouter);
 */

 module.exports = apiRouter;