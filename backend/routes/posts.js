const express = require('express');
const multer = require('multer');

const router = express();

const MIME_TIPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}
// multer configuration:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const inValid = MIME_TIPE_MAP[file.mimetype];
    let error = "mime type is invalid";
    if (inValid) {
      error = null;
    }
    cb(error,'backend/images');
  },
  filename: (req, file, cb) => {
    const name= file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TIPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

const Post = require('../models/post');

router.post('', multer({storage: storage}).single("image"), (req, res, next) => {
  console.log(req.file.filename);
  const url = req.protocol + "://" + req.get("host");

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: url + "/images/" + req.file.filename
  });
  // saving data with mongoose :
  post.save().then( createdPost => {
    console.log(post);
    res.status(201).json({
      message: 'post added !' ,
      post: {
        ...createdPost,
        id: createdPost._id
      }
    })
  });
});

router.put('/:id', multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if ( req.file ) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    image: imagePath
  })
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.json({
      message: 'post Updated !',
      post
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
