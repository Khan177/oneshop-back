const express = require('express');
const router = express.Router();
const categoryModel = require('../models/category');
const productModel = require('../models/product');

router
  .route('/')
  .all((req, res, next) => {
    res.statusCode = 200;
    next();
  })
  .get(async (req, res) => {
    const category = await categoryModel.find({});
    try {
      res.send(category);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .post(async (req, res) => {
    const category = new categoryModel(req.body);
    try {
      await category.save();
      res.send(category);
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
      if (req.params.id === 'all') {
        const product = await productModel.find();
        res.send(product);
      } else {
        const category = await categoryModel.findById(req.params.id);
        const product = await productModel.find({ category: category._id });
        res.send(product);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const category = await categoryModel.findByIdAndDelete(req.params.id);
      const product = await productModel.find({ category: category._id }).updateMany({ category: 'all' });
      res.send(product);
    } catch (err) {
      res.status(500).send(err);
    }
  });

module.exports = router;
