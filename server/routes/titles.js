'use strict';

const express = require('express');
const Title = require('../models/Title');
const titlesRouter = express.Router();
const { verifyToken, verifyAdminToken } = require('../utils/token');

titlesRouter.route('/')

  // get all titles
  .get(verifyToken, async (_, res) => {
    try {
      const result = await Title.find({});
      return res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        status: 500,
        statusText: 'Unable to retrieve titles.'
      });
    }
  })

  // create new title
  .post(verifyAdminToken, async (req, res) => {

    const title = new Title();
    title.description = req.body.description;

    if (!title.description) return res.status(400).send({
      status: 400,
      statusText: 'The title description field is missing.'
    });

    try {
      await title.save();
      return res.status(201).send({
        status: 201,
        statusText: `Title '${title.description}' was created.`
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
  