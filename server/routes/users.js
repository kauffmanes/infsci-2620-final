"use strict";

const express = require("express");
const User = require("../models/User");
const AccessLevel = require("../models/AccessLevel");
const usersRouter = express.Router();
const Token = require("../utils/token");

// endpoint: /api/users/register
usersRouter
  .route("/register")

  // register new user
  .post(async (req, res) => {
    const user = new User();

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.employer = req.body.employer;
    user.title = req.body.titleId;
    user.displayName = req.body.displayName;
    user.accessLevel = req.body.accessLevel;
    // do error handling on what's required
    if (
      !user.firstName ||
      !user.lastName ||
      !user.email ||
      !user.password ||
      !user.employer ||
      //!user.title ||
      !user.displayName
    ) {
      return res.status(400).send("All fields are required.");
    }

    // if none provided, default to regular user

    try {
      const accessObj = await AccessLevel.findOne({
        level: req.body.accessLevel || 1
      });

      user.accessLevel = accessObj;

      // save user
      user.save(err => {
        if (err && err.name === "MongoError" && err.code === 11000) {
          return res.status(400).send({
            status: 400,
            statusText: "A user with that email or display name already exists."
          });
        }

        if (err) {
          console.log(err);
          return res
            .status(500)
            .send({ status: 500, statusText: "Unable to save user." });
        }

        return User.findById(user._id, (err, user) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              status: 500,
              statusText: "Could not find newly created user."
            });
          }
          return res.status(201).send(user);
        });
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Could not find that access level.");
    }
  });

/*
  Other routes:
  reset password
  delete account
  update account info
  get account by ID
  */
usersRouter.post("/authenticate", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      status: 400,
      statusText: "An email and password are required"
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
        statusText: "No user was found for that email.",
        success: false
      });
    }

    const isValidPassword = user.comparePassword(req.body.password);

    if (!isValidPassword) {
      return res.status(400).send({
        status: 400,
        statusText: "Invalid email/password combination.",
        success: false
      });
    }

    // set user's permission level (scope)
    let scope;
    if (user.accessLevel === 2) {
      scope = "admin";
    } else if (user.accessLevel === 3) {
      scope = "developer";
    } else {
      scope = "user";
    }

    const token = Token.sign({ id: user._id, scope }, { expiresIn: 86400 }); // expires in 24 hours

    return res.status(200).send({
      success: true,
      token
    });
  } catch (err) {
    console.log(err);

    return res.status(500).send({
      success: false,
      statusText: "Unable to authenticate.",
      status: 500
    });
  }
});

// gets the token from the request, verifies it, and then returns that user's data
usersRouter.get("/me", Token.verifyToken, (req, res) => {
  User.findById(req.decoded.id)
    .then(user => {
      if (!user) {
        return res.status(404).send("No user found.");
      }
      res.status(200).send(user);
    })
    .catch(err => {
      res.status(500).send("Unable to find your information");
    });
});

// @route   DELETE api/users/
// @desc    Delete user
// @access  Private
usersRouter.delete("/", Token.verifyToken, (req, res) => {
  User.findOneAndRemove({ _id: req.decoded.id }).then(() =>
    res.json({ success: true })
  );
});

module.exports = usersRouter;
