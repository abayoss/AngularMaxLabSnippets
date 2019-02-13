const express = require('express');
const simplecrypt = require('simplecrypt');

const jwt = require('jsonwebtoken');

const sc = simplecrypt();
const router = express();

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
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
      rerror: err
    })
  });
});

router.post('/login',(req, res, next ) => {
  // compare password to DB hashed password
  User.findOne({ email: req.body.email })
  .then( user => {
    if(!user) {
      return res.status(404).json({
        message: 'authentication failed'
      });
    };
    // const decPassa = sc.encrypt(req.body.password);
    if ( req.body.password === user.password ){
      const token = jwt.sign(
          { email: req.body.email, userId : user.id },
          "secret_chould_be_longer",
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
      rerror: err
    });
  });
})
module.exports = router
