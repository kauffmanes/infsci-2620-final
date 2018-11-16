'use strict';

const express = require('express');
const AccessLevel = require('../models/AccessLevel');
const accessLevelsRouter = express.Router();
const { verifyAdminToken, verifyDeveloperToken } = require('../utils/token');

accessLevelsRouter.route('/')

  // get all titles
  .get(verifyAdminToken, async (_, res) => {
    try {
      const result = await AccessLevel.find({});
      return res.status(200).send(result);
    } catch (err) {
      return res.status(500).send({
        status: 500,
        statusText: 'Unable to retrieve access levels.'
      });
    }
  })

  // create new level
  .post(verifyDeveloperToken, async (req, res) => {

    const accessLevel = new AccessLevel();

    accessLevel.description = req.body.description;
    accessLevel.level = req.body.level;

    console.log(accessLevel)
    if (!accessLevel.description || !accessLevel.level) {
      return res.status(400).send({
        status: 400,
        statusText: 'The access level or description is missing.'
      });
    }

    try {
      await accessLevel.save();
      return res.status(201).send({
        status: 201,
        statusText: `Access level '${accessLevel.description}' was created.`
      });
    } catch (err) {
      
      if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(400).send({
          status: 400,
          statusText: 'That access level already exists.'
        });
      }

      console.log(err);
      
      return res.status(500).send({
        status: 500,
        statusText: 'Unable to save access level.'
      });
    }

  });

module.exports = accessLevelsRouter;
