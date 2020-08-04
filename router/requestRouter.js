const express = require('express');
const router = express.Router();
const requestModel = require('../models/request');
const { mongo, connection } = require('mongoose');
const Grid = require('gridfs-stream');
const GridFSStorage = require('multer-gridfs-storage');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const DB_KEY = process.env.DB_KEY;
let gfs;

connection.once('open', () => {
  gfs = Grid(connection.db, mongo);
  gfs.collection('requests');
});

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
          bucketName: 'requests',
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

router.route('/').post(upload.single('file'), async (req, res) => {
  let obj = {
    name: req.body.name,
    surname: req.body.surname,
    patronymic: req.body.patronymic,
    phone: req.body.phone,
    email: req.body.email,
    direction: req.body.direction,
    university: req.body.university,
    course: req.body.course,
    file: `${req.protocol}://${req.get('host')}${req.originalUrl}file/${req.file.filename}`,
  };
  console.log("hello");
  try {
    const request = new requestModel(obj);
    await request.save();
    res.send(request);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const request = await requestModel.find({});
    res.send(request);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/file/:filename', async (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists',
      });
    }
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
});

router.delete('/:id', async (req, res) => {
  const request = await requestModel.findByIdAndDelete(req.params.id);
  if (!request) res.status(404).send('No file found');
  let filename = request.file.split('/');
  gfs.remove({ filename: filename[filename.length - 1], root: 'requests' }, (err, GridFSBucket) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
  });
  res.send(request);
});

module.exports = router;
