const express = require('express');
const router = express.Router();
const directionModel = require('../models/direction');

router
  .route('/')
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
      res.status(500).json({ message: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      const direction = new directionModel(req.body);
      await direction.save();
      res.json({ message: 'Направление успешно добавлено!' });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
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
      const direction = await directionModel.findById(req.params.id);
      if (!direction) res.status(404).send('Направление не найдено!');
      else res.send(direction);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  })
  .delete(async (req, res) => {
    try {
      const direction = await directionModel.findByIdAndDelete(req.params.id);
      if (!direction) res.status(404).send('No direction found');
      res.status(200).send({
        message: 'Направление успешно удалено!',
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
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
          res
            .status(500)
            .json({ message: 'Ошибка при обновлении: ' + JSON.stringify(err, undefined, 2) });
      }
    );
  });

module.exports = router;
