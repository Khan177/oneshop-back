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
const secret = process.env.SECRET;

require("./config/passport");

const session = require("express-session")({
  secret: secret,
  cookie: {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  },
  resave: false,
  saveUninitialized: false,
});

const GridFSStorage = require('multer-gridfs-storage');
const GridFS = require('gridfs-stream');
const multer = require('multer');
const crypto = require('crypto');
var gfs;

app.use(express.json());
app.use(cors());
app.use(session);

app.use("/directions", directionRouter);
app.use("/qa", qaRouter);
app.use("/", usersRouter);

mongoose.connect(DB_KEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((conn) => {
  gfs = GridFS(conn.connection.db, mongoose.mongo);
  gfs.collection('uploads')
});

app.use('/directions', directionRouter);
app.use('/qa', qaRouter);

const storage = new GridFSStorage({
  url: DB_KEY,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

app.get('/images', async (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files) {
      return res.status(404).json({
        err: 'No files found'
      });
    }
    files.map(file => {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    })
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files) {
      return res.status(404).json({
        err: 'No files found'
      });
    }
    return res.json(files);
  });
});

app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file) {
      return res.status(404).json({
        err: 'No file found'
      });
    }
    return res.json(file);
  });
});

app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file) {
      return res.status(404).json({
        err: 'No file found'
      });
    }
    if (file.contentType === 'image/png' || file.contentType === 'image/jpeg') {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

app.delete('/files/:filename', (req, res) => {
  gfs.remove({ filename: req.params.filename, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
  })
});

app.listen(PORT, () => {
  console.log("Server is running...");
});
