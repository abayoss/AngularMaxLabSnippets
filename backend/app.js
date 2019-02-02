const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// returns a valid express middleware for parsing JSON data
app.use(bodyParser.json());

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

app.post('/api/posts',(req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({ message: 'post added !' })
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    { id: 1, title: 'her', content: 'her content' },
    { id: 2, title: 'her2', content: 'her2 content' },
    { id: 3, title: 'her3', content: 'her3 content' }
  ];
  res.json({
    message: 'post fetched ! ',
    posts
  });
});

module.exports = app;
// the server is listenning in '../server.js'
