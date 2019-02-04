const express = require('express');

const router = express.Router();
const Post = require('../models/post');


router.post('',(req, res, next) => {
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

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.json({
      message: 'post Updated !'
    });
  });
});

router.delete('/:id',(req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
      .then(()=> {
    res.status(203).json({ message: 'post deleted !' })
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then((post)=>{
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'post not found'})
    }
  });
});

router.get('', (req, res, next) => {
  Post.find().then((posts)=>{
    res.json({
      message: 'post fetched ! ',
      posts
    });
  });
});

module.exports = router
