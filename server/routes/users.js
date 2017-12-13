var express = require('express');
var router = express.Router();
let User = require('./../models/user.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
        // write cookie
        res.cookie('userName', userDoc.userName, {
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

// loginout
router.post('/loginout', (req, res, next) => {
  // clear cookie
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    code: 200,
    msg: 'loginout success'
  })
})

// check
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      code: 200,
      msg: '',
      result: req.cookies.userName || 'admin'
    })
  } else {
    res.json({
      code: 501,
      msg: '未登录',
      result: ''
    })
  }
})

module.exports = router;
