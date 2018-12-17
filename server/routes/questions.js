"use strict";

const express = require("express");
const Question = require("../models/Question");
const User = require("../models/User");
const Keyword = require("../models/Keyword");
const validator = require("validator");
const isEmpty = require("./is-empty");

const questionsRouter = express.Router();
const {
  verifyToken, verifyAdminToken
} = require("../utils/token");

questionsRouter
  .route("/")

  // fetch questions
  .get(verifyToken, async (req, res) => {
    const q = req.query.q || ""; // search query
    let limit =
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

      const filtered = result.filter(q => q.flags.length === 0);

      return res.status(200).send(filtered);
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
    let errors = {};
    const question = new Question();
    question.title = req.body.title;
    question.content = req.body.content;
    question.flags = req.body.flags;

    // validation
    if (isEmpty(question.title) || validator.isEmpty(question.title)) {
      errors.title = "Title field is required";
    }
    if (isEmpty(question.content) || validator.isEmpty(question.content)) {
      errors.content = "Content field is required";
    }
    if (isEmpty(errors)) {
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
    } else {
      return res.status(400).json(errors);
    }
  });

// flag question
questionsRouter.put("/id/:id/flag/:flagId", verifyToken, async (req, res) => {
  const flagId = req.params.flagId;
  const questionId = req.params.id;

  if (isEmpty(flagId)) {
    return res.status(400).send({
      status: 400,
      statusText: 'A flag ID is required.'
    });
  }

  if (isEmpty(questionId)) {
    return res.status(400).send({
      status: 400,
      statusText: 'A question ID is required.'
    });
  }

  try {
    const question = await Question.findById(questionId);
    question.flags.push(flagId);
    await question.save();
    return res.status(200).send({
      status: 200,
      statusText: `Question ${questionId} was flagged.`
    });
  } catch(err) {
    console.log(err);
    return res.status(500).send('Unable to flag question.')
  }
});

questionsRouter.get('/flagged', verifyAdminToken, async (req, res) => {
  const q = req.query.q || ""; // search query
  let limit =
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

    const filtered = result.filter(q => q.flags.length > 0);

    return res.status(200).send(filtered);
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: 500,
      statusText: "Unable to retrieve questions."
    });
  }
})

questionsRouter.put('/id/:id/flag/:flagId/clear', verifyAdminToken, async (req, res) => {
  const flagId = req.params.flagId;
  const questionId = req.params.id;

  if (isEmpty(flagId)) {
    return res.status(400).send({
      status: 400,
      statusText: 'A flag ID is required.'
    });
  }

  if (isEmpty(questionId)) {
    return res.status(400).send({
      status: 400,
      statusText: 'A question ID is required.'
    });
  }

  try {
    const question = await Question.findById(questionId);
    question.flags = [];
    await question.save();
    return res.status(200).send({
      status: 200,
      statusText: `Removed flag from question ${questionId}.`
    });
  } catch(err) {
    console.log(err);
    return res.status(500).send('Unable to flag question.')
  }

});

// @route   GET api/questions/:id
// @desc    Get question by id
// @access  Public
questionsRouter
  .route("/id/:id")
  .get(verifyToken, (req, res) => {
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
