require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT;
const DB_KEY = process.env.DB_KEY;
const productRouter = require('./router/productRouter');
const categoryRouter = require('./router/categoryRouter');
const orderRouter = require('./router/orderRouter');

app.use(express.json());
app.use(cors());

mongoose.connect(DB_KEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/orders', orderRouter);

app.listen(PORT, () => {
  console.log('Server is running...');
});
