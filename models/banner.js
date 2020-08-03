const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  }
});

const BannerModel = mongoose.model('Banner', BannerSchema);
module.exports = BannerModel;