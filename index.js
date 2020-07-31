require("dotenv").config();
require("./models/user");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT;
const DB_KEY = process.env.DB_KEY;
const directionRouter = require("./router/directionRouter");
const qaRouter = require("./router/qaRouter");
const usersRouter = require("./router/usersRouter");

require("./config/passport");

const session = require("express-session")({
  secret: "secret",
  cookie: {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  },
  resave: false,
  saveUninitialized: false,
});

app.use(express.json());
app.use(cors());
app.use(session);

app.use("/directions", directionRouter);
app.use("/qa", qaRouter);
app.use("/", usersRouter);

mongoose.connect(DB_KEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log("Server is running...");
});
