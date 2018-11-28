'use strict';

const express = require('express');
const Keyword = require('../models/Keyword');
const keywordsRouter = express.Router();
const { verifyToken, verifyAdminToken } = require('../utils/token');

keywordsRouter.route('/')

  // get all keywords
  .get(verifyToken, async (_, res) => {
    try {
      const result = await Keyword.find({});
      return res.status(200).send(result);
    } catch (err) {
      return res.status(500).send({
        status: 500,
        statusText: 'Unable to retrieve keywords.'
      });
    }
  })

  // get keywords based on search query

  // create new keyword
  .post(verifyToken, async (req, res) => {

    const keyword = new Keyword();
    keyword.description = req.body.description;
    keyword.word = req.body.word;

    if (!keyword.description) return res.status(400).send({
      status: 400,
      statusText: 'The keyword description field is missing.'
    });

    if (!keyword.word) return res.status(400).send({
      status: 400,
      statusText: 'The keyword word field is missing.'
    });

    try {
      await keyword.save();
      return res.status(201).send({
        status: 201,
        statusText: `Keyword '${keyword.word}' was created.`
      });
    } catch (err) {

      console.log(err);

      if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(400).send({
          status: 400,
          statusText: 'That keyword already exists.'
        });
      }
      
      return res.status(500).send({
        status: 500,
        statusText: 'Unable to save keyword.'
      });
    }

  });

  keywordsRouter.route('/id/:id')
    .delete(verifyToken, async (req, res) => {
      
      if (!req.params.id) { return res.status(400).send({ status: 400, statusText: 'A keyword ID is required.' }); }
      
      await Keyword.findOneAndRemove({ _id: req.params.id });

      return res.status(200).send({
        status: 200,
        statusText: `Keyword '${req.params.id}' was deleted.`
      });
    });

  module.exports = keywordsRouter;
  