// create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

// connection to mongodb
const url = 'mongodb://localhost:27017';
const dbName = 'blog';
let db;
let commentsCollection;

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err);
  db = client.db(dbName);
  commentsCollection = db.collection('comments');
});

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// GET all comments
app.get('/comments', (req, res) => {
  commentsCollection
    .find({})
    .toArray()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
});

// GET comments by post id
app.get('/comments/:id', (req, res) => {
  const { id } = req.params;
  commentsCollection
    .find({ postId: id })
    .toArray()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
});

// POST new comment
app.post('/comments', (req, res) => {
  commentsCollection
    .insertOne(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
});

// PUT update comment
app.put('/comments/:id', (req, res) => {
  const { id } = req.params;
  commentsCollection
    .findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { returnOriginal: false }
    )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
});

// DELETE comment
app.delete('/comments/:id', (req, res) => {
  const { id } = req.params;
  commentsCollection
    .deleteOne({ _id: id })
    .then((result) => {
      res.send({ deleted: result.deletedCount });
    })
});