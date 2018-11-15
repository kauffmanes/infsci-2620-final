'use strict';

const express = require('express');
const User = require('../models/User');
const usersRouter = express.Router();
const Token = require('../utils/token');

// endpoint: /api/users/
usersRouter.route('/')

  // register new user - does not require authentication
  .post((req, res) => {

    const user = new User();
    
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.employer = req.body.employer;
    user.title = req.body.titleId;
    user.displayName = req.body.displayName;

    // do error handling on what's required
    if (!user.firstName || !user.lastName || !user.email || !user.password || !user.employer || !user.title || !user.displayName) {
      return res.status(400).send('All fields are required.');
    }

    // save user
    user.save((err) => {

      if (err && err.name === 'MongoError' && err.code === 11000) {
        return res.status(400).send({
          status: 400,
          statusText: 'A user with that email or display name already exists.'
        });
      }

      if (err) {
        console.log(err);
        return res.status(500).send({ status: 500, statusText: 'Unable to save user.' });
      }
      
      return User.findById(user._id, (err, user) => {
        if (err) { console.log(err); return res.status(500).send({ status: 500, statusText: 'Could not find newly created user.' }); }
        return res.status(201).send(user);
      })
    });

  });

/*
  Other routes:
  reset password
  delete account
  update account info
  get account by ID
  */
usersRouter.post('/authenticate', async (req, res) => {

  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      status: 400,
      statusText: 'An email and password are required'
    });
  }

  try {

    const user = await User.findOne(
      { email: req.body.email }, // query
      { password: 1 } // projection
    );

    if (!user) {
      return res.status(404).send({
        status: 404,
        statusText: 'No user was found for that email.',
        success: false
      });
    }

    const isValidPassword = user.comparePassword(req.body.password);

    if (!isValidPassword) {
      return res.status(400).send({
        status: 400,
        statusText: 'Invalid email/password combination.',
        success: false
      });
    }

    // set user's permission level (scope)
    let scope;
    if (user.accessLevel === 2) {  scope = 'admin'; }
    else if (user.accessLevel === 3) { scope = 'developer'; }
    else { scope = 'user'; }

    const token = Token.sign(
      { id: user._id, scope },
      {  expiresIn: 86400 }
    );  // expires in 24 hours

    return res.status(200).send({
      success: true,
      token
    });

  } catch(err) {

    console.log(err);

    return res.status(500).send({
      success: false,
      statusText: 'Unable to authenticate.',
      status: 500
    });

  }

});

module.exports = usersRouter;
