const express = require('express');
const router = express.Router();
const productModel = require('../models/product');

router
  .route('/')
  .all((req, res, next) => {
    res.statusCode = 200;
    next();
  })
  .get(async (req, res) => {
    const product = await productModel.find({});
    try {
      res.send(product);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .post(async (req, res) => {
    const product = new productModel(req.body);
    try {
      await product.save();
      res.send(product);
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
      const product = await productModel.findById(req.params.id);
      if (!product) res.status(404).send('No product found');
      res.send(product);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const product = await productModel.findByIdAndDelete(req.params.id);
      if (!product) res.status(404).send('No product found');
      res.send(product);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .put(async (req, res) => {
    productModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else console.log('Error while updating a record : ' + JSON.stringify(err, undefined, 2));
      }
    );
  });

module.exports = router;
