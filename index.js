require('dotenv').config();
require('./models/user');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT;
const DB_KEY = process.env.DB_KEY;
const secret = process.env.SECRET;

const directionRouter = require('./router/directionRouter');
const qaRouter = require('./router/qaRouter');
const bannerRouter = require('./router/bannerRouter');
const requestRouter = require('./router/requestRouter');
const usersRouter = require('./router/usersRouter');

require('./config/passport');

mongoose.connect(DB_KEY, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const session = require('express-session')({
  secret: secret,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  },
  resave: false,
  saveUninitialized: false,
});

app.use(express.json());
app.use(cors());
app.use(session);
app.use('/directions', directionRouter);
app.use('/qa', qaRouter);
app.use('/media-images', bannerRouter);
app.use('/requests', requestRouter);
app.use('/', usersRouter);

app.listen(PORT, () => {
  console.log('Server is running...');
});
