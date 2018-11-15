'use strict';

const express = require('express');
const Title = require('../models/Title');
const titlesRouter = express.Router();

titlesRouter.route('/')

  // get all titles
  .get(async (_, res) => {
    try {
      const result = await Title.find({});
      return res.status(200).send(result);
    } catch (err) {
      return res.status(500).send({
        status: 500,
        statusText: 'Unable to retrieve titles.'
      });
    }
  })

  // create new title
  .post(async (req, res) => {

    const title = new Title();
    title.name = req.body.name;

    if (!title.name) return res.status(400).send({
      status: 400,
      statusText: 'The title name is missing.'
    });

    try {
      await title.save();
      return res.status(201).send({
        status: 201,
        statusText: `Title '${title.name}' was created.`
      });
    } catch (err) {
      
      if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(400).send({
          status: 400,
          statusText: 'That title already exists.'
        });
      }

      console.log(err);
      
      return res.status(500).send({
        status: 500,
        statusText: 'Unable to save title.'
      });
    }

  });

  module.exports = titlesRouter;
  