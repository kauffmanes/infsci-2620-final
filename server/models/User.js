'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const Config = require('../config');

const UserSchema = new Schema({
  email:       { type: String, required: true, index: { unique: true } },
  displayName: { type: String, required: true, index: { unique: true } },
  firstName:   { type: String, required: true },
  lastName:    { type: String, required: true },
  password:    { type: String, required: true, select: false },
  title:       { type: Schema.Types.ObjectId, ref: 'Title' },
  employer:    { type: String, required: true },
  verified:    { type: Boolean, required: true, default: false },
  questions:   [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  accessLevel: [{ type: Schema.Types.ObjectId, ref: 'AccessLevel', default: 1 }]
});

// before a user is saved, hash the password if updated
UserSchema.pre('save', function (next) {

  const userInstance = this;

  // if password wasn't changed, keep going
  if (!userInstance.isModified('password')) return next();

  bcrypt.hash(userInstance.password, Config.SaltRounds, (err, hash) => {
    if (err) return next(err);
    userInstance.password = hash;
    next();
  });

});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
