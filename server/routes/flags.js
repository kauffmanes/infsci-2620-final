'use strict';

const express = require('express');
const Flag = require('../models/Flag');
const flagsRouter = express.Router();
const { verifyAdminToken } = require('../utils/token');

flagsRouter.route('/')

  // get all titles
  .get(async (req, res) => {
    try {
      const results = await Flag.find({});
      return res.status(200).send(results);
    } catch (err) {
      return res.status(500).send({
        status: 500,
        statusText: 'Unable to retrieve flags.'
      });
    }
  })

  // create new title
  .post(verifyAdminToken, async (req, res) => {

    const flag = new Flag();

    flag.code = req.body.code;
    flag.description = req.body.description;

    if (!flag.code || !flag.description) return res.status(400).send({
      status: 400,
      statusText: 'The flag error code or description is missing.'
    });

    try {
      await flag.save();
      return res.status(201).send({
        status: 201,
        statusText: `Flag "${flag.code}" was created.`
      });
    } catch (err) {

      if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(400).send({
          status: 400,
          statusText: 'That flag already exists.'
        });
      }

      console.log(err);
      
      return res.status(500).send({
        status: 500,
        statusText: 'Unable to save flag.'
      });
    }

  });

  module.exports = flagsRouter;
  