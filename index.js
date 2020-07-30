require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT;
const DB_KEY = process.env.DB_KEY;
const directionRouter = require('./router/directionRouter');
const qaRouter = require('./router/qaRouter');

app.use(express.json());
app.use(cors());

mongoose.connect(DB_KEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/directions', directionRouter);
app.use('/qa', qaRouter);

app.listen(PORT, () => {
  console.log('Server is running...');
});
