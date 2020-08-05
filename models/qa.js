const mongoose = require('mongoose');

const QASchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    default: '',
  },
  important: {
    type: Boolean,
    default: false,
  },
});

const QA = mongoose.model('QA', QASchema);
module.exports = QA;
