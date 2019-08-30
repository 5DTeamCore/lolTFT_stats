/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const path = require('path');
const parser = require('body-parser');
const cloudinary = require('cloudinary').v2;
const multipart = require('connect-multiparty');
const fs = require('fs');
const connectDb = require('../../db/db');
const Items = require('../../db/items');
const secretConfig = require('../../secret-config');

const multipartMiddleware = multipart();

const app = express();
const PORT = 8001;

app.use(parser.json());

app.use(express.static(path.join(__dirname, '../dist')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

cloudinary.config({
  ...secretConfig.cloudinary,
});

const updateItem = (item, cb) => {
  Items.findOneAndUpdate({
    id: item.id,
  }, item, {
    upsert: true,
  }, (err, done) => {
    cb();
  });
};

const updateItemConnections = (parsedItem, parseItemOptions, res) => {
  if (parseItemOptions.connectChanged) {
    // Connect [1, 2, 3]
    let counter = 0;
    parsedItem.connect.forEach((c) => {
      Items.findOne({
        id: c,
      }, (err, connectItem) => {
        if (!connectItem.connect.includes(parsedItem.id)) {
          // eslint-disable-next-line no-param-reassign
          connectItem.connect = [...connectItem.connect, parsedItem.id].sort((a, b) => (a - b));
          connectItem.save((err) => {
            if (err) {
              console.error('ERROR!');
            }
            // eslint-disable-next-line no-plusplus
            counter++;
            if (counter === parsedItem.connect.length) {
              res.send('success');
            }
          });
        }
      });
    });
  } else {
    res.send('success');
  }
};

app.post('/update/item', multipartMiddleware, (req, res) => {
  const file = req.files.image;
  const {
    item,
    itemOptions,
  } = req.body;
  const parsedItem = JSON.parse(item);
  const parseItemOptions = JSON.parse(itemOptions);
  if (file) {
    const options = {
      public_id: file.originalFilename.split('.')[0],
      folder: 'items',
    };
    cloudinary.uploader.upload(file.path, options, (error, result) => {
      try {
        fs.unlinkSync(file.path);
        // file removed
        parsedItem.logo.src = result.url;
        updateItem(parsedItem, () => {
          updateItemConnections(parsedItem, parseItemOptions, res);
        });
      } catch (err) {
        console.error(err);
      }
    });
  } else {
    updateItem(parsedItem, () => {
      updateItemConnections(parsedItem, parseItemOptions, res);
    });
  }
});

app.get('/items', (req, res) => {
  Items.find({

  }, (err, items) => {
    res.send(items);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log('Listening to port: ', PORT);
  });
});
