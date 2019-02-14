
const Post = require('../models/post');


exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  // saving data with mongoose :
  post.save().then( createdPost => {
    res.status(201).json({
      message: 'post added !' ,
      post: {
        ...createdPost,
        id: createdPost._id
      }
    })
  }).catch( err => {
    res.status(500).json({
      message: 'post creation failed !'
    })
  });
}

exports.editPost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if ( req.file ) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    image: imagePath,
    creator: req.userData.userId
  })
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if ( result.n > 0 ){
      res.json({
        message: 'post Updated !',
        post
      });
    } else {
        res.status(401).json({
          message: 'Not Autorized !',
          post
        });
    }
  }).catch( err => {
    res.status(500).json({
      message: 'post Edit failed !'
    })
  });
};
exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then((post)=>{
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'post not found'})
    }
  }).catch( err => {
    res.status(500).json({
      message: 'failed to fetch the Post !'
    })
  });
};
exports.getPosts = (req, res, next) => {
  pagesize = +req.query.pagesize;
  currentPage = +req.query.page;
  postQuery = Post.find();
  let docs;
  if(pagesize && currentPage) {
    postQuery.skip( pagesize * (currentPage - 1))
    .limit(pagesize)
  }

  postQuery.then(documents => {
    docs = documents;
    return Post.countDocuments();
  })
  .then((posts)=>{
    res.json({
      message: 'post fetched ! ',
      posts : docs,
      maxPosts: posts
    });
  }).catch( err => {
    res.status(500).json({
      message: 'failed to Fetch Posts !'
    })
  });
};
exports.deletPost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
      .then((result)=> {
        if ( result.n > 0 ){
          res.json({
            message: 'post Deleted !',
          });
        } else {
            res.status(401).json({
              message: 'Not Autorized !',
              post
            });
        }
  }).catch( err => {
    res.status(500).json({
      message: 'post Deletion failed !'
    })
  });
}
