'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccessLevelSchema = new Schema({
  description: { type: String, required: true, index: { unique: true } },
  level: { type: Number, required: true, index: { unique: true } }
});

module.exports = mongoose.model('AccessLevel', AccessLevelSchema);
