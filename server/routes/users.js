"use strict";

const express = require("express");
const User = require("../models/User");
const AccessLevel = require("../models/AccessLevel");
const usersRouter = express.Router();
const Token = require("../utils/token");
const validator = require("validator");
const isEmpty = require("./is-empty");
const Config = require("../config");
const duo_web = require("@duosecurity/duo_web");
const bodyParser = require("body-parser").json();

// endpoint: /api/users/register
usersRouter
  .route("/register")

  // register new user
  .post(async (req, res) => {
    let errors = {};

    const user = new User();

    if (!req.body.tandc) {
      errors.tandc = "Please Accept the Terms and Conditions";
    }

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    const password2 = req.body.password2;
    user.employer = req.body.employer;
    user.title = req.body.titleId;
    user.displayName = req.body.displayName;
    user.accessLevel = req.body.accessLevel;

    // do error handling on what's required
    if (validator.isEmpty(user.firstName || "")) {
      errors.firstName = "First name field is required";
    }
    if (validator.isEmpty(user.lastName || "")) {
      errors.lastName = "Last name field is required";
    }
    if (validator.isEmpty(user.displayName || "")) {
      errors.displayName = "Display name field is required";
    }
    if (validator.isEmpty(user.employer || "")) {
      errors.employer = "Employer field is required";
    }
    if (validator.isEmpty(user.email || "")) {
      errors.email = "Email field is required";
    }
    if (!validator.isEmail(user.email || "")) {
      errors.email = "Email is invalid";
    }
    if (!validator.isLength(user.password || "", { min: 6, max: 30 })) {
      errors.password = "Password must be between 6 and 30 characters";
    }
    if (validator.isEmpty(user.password || "")) {
      errors.password = "Password field is required";
    }
    if (validator.isEmpty(password2 || "")) {
      errors.password2 = "Confirm Password field is required";
    }
    if (!validator.equals(user.password || "", password2 || "")) {
      errors.password2 = "Passwords must match";
    }
    if (validator.isAlphanumeric(user.password || "")) {
      errors.password =
        "Passwords must contain atleast 1 uppercase, 1 lowercase, 1 digits and 1 special character";
    }
    if (validator.isLowercase(user.password || "")) {
      errors.password =
        "Passwords must contain atleast 1 uppercase, 1 lowercase, 1 digits and 1 special character";
    }
    if (isEmpty(errors)) {
      // if none provided, default to regular user
      try {
        const accessObj = await AccessLevel.findOne({
          level: req.body.accessLevel || 1
        });

        user.accessLevel = accessObj._id;

        // save user
        user.save(err => {
          if (err && err.name === "MongoError" && err.code === 11000) {
            errors.email = "A user with that email exists.";
            return res.status(400).json(errors);
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
    } else {
      return res.status(400).json(errors);
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
  let errors = {};
  if (!validator.isEmail(req.body.email)) {
    errors.email = "Email is invalid";
  }

  if (validator.isEmpty(req.body.email)) {
    errors.email = "Email field is required";
  }
  //console.log(Config.akey);

  if (validator.isEmpty(req.body.password)) {
    errors.password = "Password field is required";
  }
  const user = await User.findOne(
    { email: req.body.email }, // query
    { password: 1, accessLevel: 1 } // projection
  );
  if (!user) {
    errors.email = "User does not exist";
    return res.status(404).json(errors);
  }
  const isValidPassword = user.comparePassword(req.body.password);

  if (!isValidPassword) {
    errors.password = "Invalid username and password";
    return res.status(404).json(errors);
  }

  if (isEmpty(errors)) {
    try {
      // set user's permission level (scope)
      //console.log(user);
      const access = await AccessLevel.findById(user.accessLevel);
      const token = Token.sign(
        { id: user._id, scope: access.level },
        { expiresIn: 86400 }
      ); // expires in 24 hours

      console.log('ikey', Config.IKey);
      console.log('skey', Config.SKey);
      console.log('akey', Config.AKey);
      console.log('email', req.body.email);

      const sig_request = duo_web.sign_request(
        Config.ikey,
        Config.skey,
        Config.akey,
        req.body.email
      );

      console.log('sig req', sig_request);
      return res.status(200).send({
        success: true,
        token,
        sig_request
      });
    } catch (err) {
      console.log(err);

      return res.status(500).send({
        success: false,
        statusText: "Unable to authenticate.",
        status: 500
      });
    }
  } else {
    return res.status(400).json(errors);
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
      console.log(err);
      res.status(500).send("Unable to find your information");
    });
});

// @route   DELETE api/users/me
// @desc    Delete user
// @access  Private
usersRouter.delete("/me", Token.verifyToken, (req, res) => {
  User.findOneAndRemove({ _id: req.decoded.id }).then(() =>
    res.status(200).send({
      status: 200,
      statusText: `Successfully deleted user ${req.decoded.id}.`,
      success: true
    })
  );
});

// delete other user
usersRouter.delete("/id/:id", Token.verifyToken, (req, res) => {
  const _id = req.params.id;

  if (!_id) {
    return res.status(400).send({
      status: 400,
      statusText: "A user ID is required."
    });
  }

  User.findOneAndRemove({ _id }).then(() =>
    res.status(200).send({
      status: 200,
      statusText: `Successfully deleted user ${req.decoded.id}.`,
      success: true
    })
  );
});

// @route   DELETE api/users/duo
// @desc    Verify DUO Response
// @access  Public
usersRouter.post("/duo", (req, res) => {
  console.log(req.body);
  /*const sig_response = req.body.sig_response;
  const authenticated_username = duo_web.verify_response(
    Config.ikey,
    Config.skey,
    Config.akey,
    sig_response
  );
  console.log(authenticated_username);*/
});

module.exports = usersRouter;
