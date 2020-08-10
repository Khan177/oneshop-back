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
      res.status(500).json({ message: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      const qa = new qaModel(req.body);
      await qa.save();
      res.send(qa);
    } catch (err) {
      res.status(500).json({ message: err.message });
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
      if (!qa) res.status(404).send('Вопрос не найден!');
      else res.send(qa);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .patch(async (req, res) => {
    const updateObj = {};
    for (const ops of req.body) {
      updateObj[ops.prop] = ops.value;
    }
    qaModel.findByIdAndUpdate(req.params.id, { $set: updateObj }, { new: true }, (err, docs) => {
      if (!err) res.send(docs);
      else
        res
          .status(500)
          .json({ message: 'Ошибка при обновлении: ' + JSON.stringify(err, undefined, 2) });
    });
  })
  .delete(async (req, res) => {
    try {
      const qa = await qaModel.findByIdAndDelete(req.params.id);
      if (!qa) res.status(404).send('Вопрос не найден!');
      res.status(200).send({
        message: 'Вопрос успешно удален!',
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
