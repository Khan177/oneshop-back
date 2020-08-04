const express = require('express');
const router = express.Router();
const bannerModel = require('../models/banner');
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
  gfs.collection('banners');
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
          bucketName: 'banners',
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

router.route('/').post(upload.single('file'), async (req, res) => {
  if (!(req.file.contentType === 'image/jpeg' || req.file.contentType === 'image/png')) {
    res.status(500).json({
      message: 'Wrong format, only .jpeg or .png',
    });
  } 
  else {
    let obj = {
      title: req.body.title,
      description: req.body.description,
      buttonText: req.body.buttonText,
      img: `${req.protocol}://${req.get('host')}${req.originalUrl}/${req.file.filename}`,
      url: req.body.url,
    };
    try {
      const banner = new bannerModel(obj);
      await banner.save();
      res.send(banner);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const banner = await bannerModel.find({});
    res.send(banner);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/image/:filename', async (req, res) => {
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
  const banner = await bannerModel.findByIdAndDelete(req.params.id);
  if (!banner) res.status(404).send('No banner found');
  let filename = banner.img.split('/');
  gfs.remove({ filename: filename[filename.length - 1], root: 'banners' }, (err, GridFSBucket) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
  });
  res.send(banner);
});

module.exports = router;
