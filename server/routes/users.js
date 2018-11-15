'use strict';

const express = require('express');
const User = require('../models/User');
const usersRouter = express.Router();

// endpoint: /api/users/
usersRouter.route('/')

  // register new user - does not require authentication
  .post((req, res) => {

    const user = new User();
    
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;

    // do error handling on what's required
    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      return res.status(400).send('All fields are required.');
    }

    // save user
    user.save((err) => {
      if (err) { console.log(err); return res.status(500).send('Unable to save user.'); }
      return User.findById(user._id, (err, user) => {
        if (err) { console.log(err); return res.status(500).send('Could not find newly created user.'); }
        return res.status(201).send(user);
      })
    });

  });

module.exports = usersRouter;