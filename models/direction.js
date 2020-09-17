const mongoose = require("mongoose");

const DirectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const DirectionModel = mongoose.model("Direction", DirectionSchema);
module.exports = DirectionModel;
