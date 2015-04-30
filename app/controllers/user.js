var express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('underscore'),
    config = require('../../config/config'),
    Converter = require('../services/converter'),
    GameCore = require('../services/gameCore'),
    sha1 = require('sha1')


module.exports = function (app) {
  app.use('/', router);
}


/*router.get('/', function(req, res, next){
  res.sendFile(__dirname + '/index.html');
})*/

router.post('/login', function (req, res, next) {
  var user = User.find({name: req.body.username}).exec(function(err, user) {
    if(err) res.status(401).end()
    if(_.size(user) > 0) {
      u = user[0]
      if(u.password == sha1(req.body.password)) {
        //u.platform = req.body.plateform
        var token = jwt.sign(Converter.user(u, req.body.plateform), config.jwtSecret, { expiresInMinutes: 60*5 });
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
  var userExist = User.find({name: req.body.username}).exec(function(err, user) {
    if(err) res.status(401).end()
    if(_.size(user) > 0) {
      u = user[0]
      if(u.password == sha1(req.body.password)) {
        //u.platform = req.body.plateform
        var token = jwt.sign(Converter.user(u, req.body.plateform), config.jwtSecret, { expiresInMinutes: 60*5 });
        res.json({token: token});
      } else {
        res.status(401).end()
      }
    } else {
      res.status(401).end()
    }
  })
  var user = new User({
    name: req.body.username,
    password: sha1(req.body.password),
    xp: 0
  })
  GameCore.getRank(user, function(err, rank){
    if(err) console.log(err)
    user.level = rank._id
    user.save(function(err, userSaved) {
      res.status(201).json(Converter.user(userSaved))
    })
  })
})

router.post("/logout", function(req, res, next){
  if(jwt.decode(req.body.token)) {
    var decoded = jwt.decode(req.body.token)
    io.disconnectUser(decoded)
    res.status(200).end()
  } else {
    res.status(200).end()
  }
})