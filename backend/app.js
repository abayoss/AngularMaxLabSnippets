const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();
// returns a valid express middleware for parsing JSON data
app.use(bodyParser.json());

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

app.post('/api/posts',(req, res, next) => {
  // using body parser to get body :
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // saving data with mongoose :
  post.save().then( createdPost => {
    console.log(post);
    res.status(201).json({
      message: 'post added !' ,
      postId: createdPost._id
    })
  });
});

app.delete('/api/posts/:id',(req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
      .then(()=> {
    res.status(203).json({ message: 'post deleted !' })
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find().then((posts)=>{
    res.json({
      message: 'post fetched ! ',
      posts
    });
  });
});

module.exports = app;
// the server is listenning in '../server.js'
