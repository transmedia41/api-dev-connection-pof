var express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
    config = require('../../config/config')

module.exports = function (app) {
  app.use('/', router);
}

var sid = 1;

router.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
})

router.post('/login', function (req, res) {
  
  var password = 'admin1234'

  // TODO: validate the actual user
  var profile = {
    name: req.body.username,
    id: sid++
  }
  
  if(true) {
    // we are sending the profile in the token
    //console.info('auth successed')
    var token = jwt.sign(profile, config.jwtSecret, { expiresInMinutes: 60*5 });
    res.json({token: token}); // res.status(401).end(); 
  } else {
    //console.info('auth failed')
    res.status(401).end(); 
  }
  
})