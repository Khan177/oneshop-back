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

router
  .route('/')
  .get(async (req, res) => {
    try {
      const request = await requestModel.find({});
      res.send(request);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  .post(upload.single('file'), async (req, res) => {
    if (!req.file || Object.keys(req.body).length === 0) {
      res.status(500).json({
        message: 'Не все поля заполнены!',
      });
    }
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
    try {
      const request = new requestModel(obj);
      await request.save();
      res.send(request);
    } catch (err) {
      res.status(500).send(err);
    }
  });

router.route('/file/:filename').get(async (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'Файл не найден!',
      });
    }
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
});

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      const request = await requestModel.findById(req.params.id);
      if (!request) res.status(404).send('Заявка не найдена!');
      else res.send(request);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  .delete(async (req, res) => {
    const request = await requestModel.findByIdAndDelete(req.params.id);
    if (!request) res.status(404).send('Заявка не найдена!');
    let filename = request.file.split('/');
    gfs.remove(
      { filename: filename[filename.length - 1], root: 'requests' },
      (err, GridFSBucket) => {
        if (err) {
          return res.status(404).json({ err: err });
        }
      }
    );
    res.status(200).send({
      message: 'Заявка успешно удалена!',
    });
  });

module.exports = router;
