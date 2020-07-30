const express = require('express');
const router = express.Router();
const productModel = require('../models/product');
const orderModel = require('../models/order');

router
  .route('/')
  .all((req, res, next) => {
    res.statusCode = 200;
    next();
  })
  .get(async (req, res) => {
    await orderModel
      .find()
      .select('_id product quantity')
      .populate('product')
      .exec()
      .then((docs) => {
        res.status(200).json({
          count: docs.length,
          orders: docs,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  })
  .post(async (req, res) => {
    await productModel
      .findById(req.body.product)
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            message: 'Product not found',
          });
        }
        const order = new orderModel({
          quantity: req.body.quantity,
          product: req.body.product,
        });
        return order.save();
      })
      .then((result) => res.status(200).json(result))
      .catch((err) =>
        res.status(500).json({
          message: 'Invalid ID',
          error: err,
        })
      );
  });

router
  .route('/:orderId')
  .all((req, res, next) => {
    res.statusCode = 200;
    next();
  })
  .get(async (req, res) => {
    await orderModel
      .findById(req.params.orderId)
      .populate('product')
      .then((order) => {
        if (!order) {
          return res.status(404);
        }
        res.send(order);
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  })
  .delete(async (req, res) => {
    await orderModel
      .remove({ _id: req.params.orderId })
      .exec()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });

module.exports = router;
