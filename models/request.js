const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  fathername: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  course: {
    type: Number,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
});

const requestModel = mongoose.model('Request', RequestSchema);
module.exports = requestModel;
