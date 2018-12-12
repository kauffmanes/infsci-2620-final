const express = require("express");
const Answer = require("../models/Answer");
const User = require("../models/User");
const Question = require("../models/Question");
const validator = require("validator");
const isEmpty = require("./is-empty");

const answersRouter = express.Router();
const { verifyToken } = require("../utils/token");

answersRouter
  .route("/")

  .post(verifyToken, async (req, res) => {
    let errors = {};
    const answer = new Answer();
    answer.content = req.body.content;
    answer.questionId = req.body.questionId;

    // validation
    if (isEmpty(answer.content) || validator.isEmpty(answer.content)) {
      errors.content = "Content field is required";
    }
    if (isEmpty(errors)) {
      if (!answer.questionId) {
        return res.status(400).send({
          status: 400,
          statusText: "The associated question ID for this answer is missing."
        });
      }

      try {
        // get author automatically
        answer.author = await User.findById(req.decoded.id);
      } catch (err) {
        console.log(err);
        return res.status("Unable to establish the author of the answer.");
      }

      // create the answer post
      try {
        await answer.save();
      } catch (err) {
        console.log(err);

        return res.status(500).send({
          status: 500,
          statusText: "Unable to save answer."
        });
      }

      // add answer to question

      try {
        const question = await Question.findById(answer.questionId);
        question.answers.push(answer);
        await question.save();
        Question.findById(answer.questionId)
          .populate({
            path: "answers",
            populate: {
              path: "author",
              select: "firstName lastName displayName"
            }
          })
          .then(post => res.json(post));
      } catch (err) {
        console.log(err);
        return res.status(500).send({
          status: 500,
          statusText: "Unable to associate answer with question."
        });
      }
    } else {
      return res.status(400).json(errors);
    }

    /*return res.status(201).send({
      status: 201,
      statusText: 'Answer was posted.'
    });*/
  });
// delete answer
answersRouter.route("/id/:id").delete(verifyToken, async (req, res) => {
  //onsole.log(req.params);
  Answer.findOneAndRemove({ _id: req.params.id })
    .then(() => {
      res.status(200).send({
        status: 200,
        statusText: `Successfully deleted answer ${req.params.id}.`
      });
    })
    .catch(err => {
      res.status(500).send(`Unable to delete answer ${req.query.id}.`);
    });
});

// flag answer
// edit answer

module.exports = answersRouter;
