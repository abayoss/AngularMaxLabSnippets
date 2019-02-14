const jwt = require('jsonwebtoken');

const simplecrypt = require('simplecrypt');
const sc = simplecrypt();

const User = require('../models/user');


exports.userLogin = (req, res, next ) => {
  // compare password to DB hashed password
  User.findOne({ email: req.body.email })
  .then( user => {
    if(!user) {
      return res.status(404).json({
        message: 'invalid loging credentials !'
      });
    };
    // const decPassa = sc.encrypt(req.body.password);
    if ( req.body.password === user.password ){
      const token = jwt.sign(
          { email: req.body.email, userId : user.id },
          process.env.JWT_KEY,
          { expiresIn: "10h" }
        );
        res.status(200).json({
          token,
          expiresIn: 3600,
          userId: user.id
        });
    };
    // catch errors
  }).catch( err => {
    res.status(404).json({
      message: 'invalid loging credentials !',
      rerror: err
    });
  });
}

exports.createUser = (req, res, next) => {
  // const encPassword = sc.encrypt(req.query.password);
  const user = new User({
    email: req.body.email,
    // password: encPassword,
    password: req.body.password
  });
  user.save().then(result => {
    res.status(200).json({
      message: 'user created',
      result
    });
  }).catch(err=>{
    res.status(404).json({
      message: 'email invalid or already in use',
      rerror: err
    })
  });
}
