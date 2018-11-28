'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KeywordSchema = new Schema({
  description: { type: String, required: true },
  word: { type: String, required: true }
});

KeywordSchema.index({
  description: 'text',
  word: 'text'
});

module.exports = mongoose.model('Keyword', KeywordSchema);
