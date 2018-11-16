'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KeywordSchema = new Schema({
  description: { type: String, required: true, index: { unique: true } },
  code: { type: String, required: true, index: { unique: true } }
});

module.exports = mongoose.model('Flag', KeywordSchema);
