var express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    config = require('../../config/config')

module.exports = function (app) {
  app.use('/', router);
}

var sid = 1;

router.get('/', function(req, res, next){
  res.sendFile(__dirname + '/index.html');
})

router.post('/login', function (req, res, next) {
  var user = User.find({name: req.body.username}).exec(function(err, user) {
    if(err) res.status(401).end()
    u = user[0]
    if(u.password == req.body.password) {
      var token = jwt.sign(u, config.jwtSecret, { expiresInMinutes: 60*5 });
      res.json({token: token});
    } else {
      res.status(401).end();
    }
  })
})

router.post('/register', function (req, res, next) {
  var user = new User({
    name: req.body.name,
    password: req.body.password
  })
  user.save(function(err, userSaved) {
    res.status(201).json(userSaved);
  })
})

router.post("/logout", function(req, res, next){
  var decoded = jwt.decode(req.body.tocken)
  io.disconnectUser(decoded._id)
})