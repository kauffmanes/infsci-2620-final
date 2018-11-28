'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  keywords: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }],
  flags: [{ type: Schema.Types.ObjectId, ref: 'Flag' }],
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
  author: { type: Schema.Types.ObjectId, ref: 'User' }
});

// indexable by 'text' - allows for querying
QuestionSchema.index({
  title: 'text',
  content: 'text',
  keywords: 'text'
});

module.exports = mongoose.model('Question', QuestionSchema);
