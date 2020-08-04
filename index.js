require('dotenv').config();
require('./models/user');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT;
const DB_KEY = process.env.DB_KEY;
<<<<<<< Updated upstream
=======
const path = require("path");
const directionRouter = require("./router/directionRouter");
const qaRouter = require("./router/qaRouter");
const usersRouter = require("./router/usersRouter");
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
app.use(express.json());
app.use(cors());
app.use(session);
app.use('/directions', directionRouter);
app.use('/qa', qaRouter);
app.use('/media-images', bannerRouter);
app.use('/requests', requestRouter);
app.use('/', usersRouter);
=======
const GridFSStorage = require("multer-gridfs-storage");
const GridFS = require("gridfs-stream");
const multer = require("multer");
const crypto = require("crypto");
var gfs;

app.use(express.json());
app.use(cors());
app.use(session);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

app.use("/directions", directionRouter);
app.use("/qa", qaRouter);
app.use("/", usersRouter);

mongoose
  .connect(DB_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    gfs = GridFS(conn.connection.db, mongoose.mongo);
    gfs.collection("uploads");
  });

app.use("/directions", directionRouter);
app.use("/qa", qaRouter);

const storage = new GridFSStorage({
  url: DB_KEY,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

app.get("/images", async (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files) {
      return res.status(404).json({
        err: "No files found",
      });
    }
    files.map((file) => {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    });
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.body.file);
  res.json({ file: req.file });
});

app.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files) {
      return res.status(404).json({
        err: "No files found",
      });
    }
    return res.json(files);
  });
});

app.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file) {
      return res.status(404).json({
        err: "No file found",
      });
    }
    return res.json(file);
  });
});

app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file) {
      return res.status(404).json({
        err: "No file found",
      });
    }
    if (file.contentType === "image/png" || file.contentType === "image/jpeg") {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

app.delete("/files/:filename", (req, res) => {
  gfs.remove(
    { filename: req.params.filename, root: "uploads" },
    (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
    }
  );
});
>>>>>>> Stashed changes

app.listen(PORT, () => {
  console.log('Server is running...');
});
