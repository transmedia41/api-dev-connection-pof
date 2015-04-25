var express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('underscore'),
    config = require('../../config/config'),
    Converter = require('../services/converter'),
    sha1 = require('sha1')


module.exports = function (app) {
  app.use('/', router);
}

var sid = 1;

/*router.get('/', function(req, res, next){
  res.sendFile(__dirname + '/index.html');
})*/

router.post('/login', function (req, res, next) {
  var user = User.find({name: req.body.username}).exec(function(err, user) {
    if(err) res.status(401).end()
    if(_.size(user) > 0) {
      u = user[0]
      if(u.password == sha1(req.body.password)) {
        var token = jwt.sign(Converter.user(u), config.jwtSecret, { expiresInMinutes: 60*5 });
        res.json({token: token});
      } else {
        res.status(401).end()
      }
    } else {
      res.status(401).end()
    }
  })
})

router.post('/register', function (req, res, next) {
  var user = new User({
    name: req.body.username,
    password: sha1(req.body.password)
  })
  user.save(function(err, userSaved) {
    res.status(201).json(Converter.user(userSaved))
  })
})

router.post("/logout", function(req, res, next){
  if(jwt.decode(req.body.token)) {
    var decoded = jwt.decode(req.body.token)
    io.disconnectUser(decoded.id)
    res.status(200).end()
  } else {
    res.status(200).end()
  }
})