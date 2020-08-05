const express = require('express');
const router = express.Router();
const qaModel = require('../models/qa');

router
  .route('/')
  .all((req, res, next) => {
    res.statusCode = 200;
    next();
  })
  .get(async (req, res) => {
    const qa = await qaModel.find({});
    try {
      res.send(qa);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .post(async (req, res) => {
    try {
      const qa = new qaModel(req.body);
      await qa.save();
      res.send(qa);
    } catch (err) {
      res.status(500).send(err);
    }
  });

router
  .route('/:id')
  .all((req, res, next) => {
    res.statusCode = 200;
    next();
  })
  .get(async (req, res) => {
    try {
      const qa = await qaModel.findById(req.params.id);
      if (!qa) res.status(404).send('No Q&A found');
      else res.send(qa);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .put(async (req, res) => {
    qaModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else console.log('Error while updating a record : ' + JSON.stringify(err, undefined, 2));
      }
    );
  })
  .delete(async (req, res) => {
    try {
      const qa = await qaModel.findByIdAndDelete(req.params.id);
      res.send(qa);
    } catch (err) {
      res.status(500).send(err);
    }
  });

module.exports = router;
