'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  keywords: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }],
  flags: [{ type: Schema.Types.ObjectId, ref: 'Flag' }]
});

module.exports = mongoose.model('Question', QuestionSchema);
