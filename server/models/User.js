'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 12;

const UserSchema = new Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  email:      { type: String, required: true, index: { unique: true } },
  password:   { type: String, required: true, select: false }
});


// before a user is saved, hash the password if updated
UserSchema.pre('save', (next) => {

  // might need const user = this;

  // if password wasn't changed, keep going
  if (!this.isModified('password')) return next();

  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });

});

module.exports = mongoose.model('User', UserSchema);
