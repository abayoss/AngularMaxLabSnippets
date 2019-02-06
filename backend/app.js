const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PostsRouter = require('./routes/posts')

const app = express();
// returns a valid express middleware for parsing JSON data
app.use(bodyParser.json());
// grant access to the images folder
app.use('/images', express.static(path.join('backend/images')));

mongoose.connect('mongodb://localhost/maxNodeAng', {
  useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...!'))
  .catch(err => console.log(err))

// Adding headers to prevent Cors error :
app.use(function (req, res, next) {

  // Website you wish to allow to connect || * to allow all websites
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use('/api/posts', PostsRouter);

module.exports = app;
// the server is listenning in '../server.js'
