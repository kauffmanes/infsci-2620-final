"use strict";

const express = require("express");
const Question = require("../models/Question");
const User = require("../models/User");
const Keyword = require("../models/Keyword");

const questionsRouter = express.Router();
const {
  verifyToken,
  verifyAdminToken,
  verifyDeveloperToken
} = require("../utils/token");

questionsRouter
  .route("/")

  // fetch questions
  .get(verifyToken, async (req, res) => {
    const q = req.query.q || ""; // search query
    const limit =
      req.query.limit !== "undefined" ? parseInt(req.query.limit, 10) : 10;

    // pagination validation
    if (limit > 100) {
      limit = 100;
    } // max of 100 results
    if (limit < 0) {
      limit = 0;
    } // default to 0

    const offset =
      req.query.offset !== "undefined"
        ? parseInt(req.query.offset, 10) * limit
        : 0;

    const params = q ? { $text: { $search: q } } : {};

    try {
      const result = await Question.find(params)
        .populate("answers")
        .populate("author", "firstName lastName displayName")
        .limit(limit)
        .skip(offset);

      return res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        status: 500,
        statusText: "Unable to retrieve questions."
      });
    }
  })

  .post(verifyToken, async (req, res) => {
    const keywords = req.body.keywordIds || [];

    const question = new Question();
    question.title = req.body.title;
    question.content = req.body.content;
    question.flags = req.body.flags;

    // validation
    if (!question.title) {
      return res
        .status(400)
        .send({ status: 400, statusText: "The title field is missing." });
    }
    if (!question.content) {
      return res
        .status(400)
        .send({ status: 400, statusText: "The content field is missing." });
    }

    for (let i = 0; i < keywords.length; i++) {
      try {
        const _id = await Keyword.findById(keywords[i]);
        question.keywords.push(_id);
      } catch (err) {
        console.log(err);
        return res
          .status(500)
          .send({ status: 500, statusText: "Unable to save keyword." });
      }
    }

    try {
      // get author automatically
      question.author = await User.findById(req.decoded.id);
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        status: 500,
        statusText: "Unable to establish the author of the question."
      });
    }

    try {
      question.save().then(question => res.json(question));
    } catch (err) {
      if (err.name === "MongoError" && err.code === 11000) {
        return res.status(400).send({
          status: 400,
          statusText: "That question already exists."
        });
      }

      console.log(err);

      return res.status(500).send({
        status: 500,
        statusText: "Unable to save question."
      });
    }
  });

// flag question
// questionsRouter.route("/question/id/:id").put();

// @route   GET api/questions/:id
// @desc    Get question by id
// @access  Public
questionsRouter
  .route("/id/:id")

  .get((req, res) => {
    Question.findById(req.params.id)
      .populate({
        path: "answers",
        populate: {
          path: "author",
          select: "firstName lastName displayName"
        }
      })
      .then(post => res.json(post))
      .catch(err =>
        res
          .status(404)
          .json({ noquestionfound: "No question found with that ID" })
      );
  })

  // delete question
  .delete(verifyToken, async (req, res) => {
    Question.findOneAndRemove({ _id: req.params.id })
      .then(() => {
        res.status(200).send({
          status: 200,
          statusText: `Successfully deleted question ${req.params.id}.`
        });
      })
      .catch(err => {
        res.status(500).send(`Unable to delete question ${req.query.id}.`);
      });
  });

// edit question

module.exports = questionsRouter;
