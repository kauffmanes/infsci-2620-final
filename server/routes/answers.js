const express = require('express');
const Answer = require('../models/Answer');
const User = require('../models/User');
const Question = require('../models/Question');

const answersRouter = express.Router();
const { verifyToken } = require('../utils/token');

answersRouter.route('/')

  .post(verifyToken, async (req, res) => {

    const answer = new Answer();
    answer.content = req.body.content;
    answer.questionId = req.body.questionId;
    
    	// validation
		if (!answer.content) {
      return res.status(400).send({
        status: 400,
        statusText: 'The content field is missing.'
      });
    }

    if (!answer.questionId) {
      return res.status(400).send({
        status: 400,
        statusText: 'The associated question ID for this answer is missing.'
      });
    }

    try {
      // get author automatically
      answer.author = await User.findById(req.decoded.id);
    } catch (err) {
      console.log(err);
      return res.status('Unable to establish the author of the answer.');
    }

    // create the answer post
    try {
      await answer.save();
    } catch (err) {
      console.log(err);

      return res.status(500).send({
				status: 500,
				statusText: 'Unable to save answer.'
      });
      
    }

    // add answer to question

    try {

      const question = await Question.findById(answer.questionId);
      question.answers.push(answer);
      await question.save();

    } catch (err) {
      console.log(err);
      return res.status(500).send({
        status: 500,
        statusText: 'Unable to associate answer with question.'
      });
    }

    return res.status(201).send({
      status: 201,
      statusText: 'Answer was posted.'
    });

  });

  // flag answer
  // edit answer
  // delete answer

module.exports = answersRouter;
