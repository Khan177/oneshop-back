const express = require("express");
const router = express.Router();
const directionModel = require("../models/direction");

router
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.send;
    next();
  })
  .get(async (req, res) => {
    const direction = await directionModel.find({});
    try {
      res.send(direction);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .post(async (req, res) => {
    try {
      const direction = new directionModel(req.body);
      await direction.save();
      res.send(direction);
    } catch (err) {
      res.status(500).send(err);
    }
  });

router
  .route("/:id")
  .all((req, res, next) => {
    res.statusCode = 200;
    next();
  })
  .get(async (req, res) => {
    try {
      const direction = await directionModel.findById(req.params.id);
      if (!direction) res.status(404).send("No direction found");
      res.send(direction);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const direction = await directionModel.findByIdAndDelete(req.params.id);
      if (!direction) res.status(404).send("No direction found");
      res.send(direction);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .put(async (req, res) => {
    directionModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else
          console.log(
            "Error while updating a record : " +
              JSON.stringify(err, undefined, 2)
          );
      }
    );
  });

module.exports = router;
