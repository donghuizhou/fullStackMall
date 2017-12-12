var express = require('express');
var router = express.Router();
let User = require('./../models/user.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
  res.send('test txt');
});

// login
router.post('/login', (req, res, next) => {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, (err, userDoc) => {
    if (err) {
      res.json({
        code: 501,
        msg: err.message
      })
    } else {
      if (userDoc) {
        // write cookie
        res.cookie('userId', userDoc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60 
        })
        // write session
        // req.session.user = userDoc
        res.json({
          code: 200,
          msg: '',
          result: {
            userName: userDoc.userName
          }
        })
      }
    }
  })
})

module.exports = router;
