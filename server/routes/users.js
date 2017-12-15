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

// 查询当前用户的购物车数据
router.get('/cartList', (req, res, next) => {
  let userId = req.cookies.userId
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        code: 501,
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          code: 200,
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})

// 删除购物车
router.post('/cartDel', (req, res, next) => {
  let userId = req.cookies.userId,
      productId = req.body.productId
  // mongoose 提供的pull api 来删除数据库    
  User.update({
    userId: userId
  }, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        code: 501,
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        code: 200,
        msg: '',
        result: 'success'
      })
    }
  })  
})

// 购物车商品数量的加减
router.post('/cartEdit', (req, res, next) => {
  let userId = req.cookies.userId,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked
  User.update({'userId': userId, 'cartList.productId': productId}, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, doc) => {
    if (err) {
      res.json({
        code: 501,
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          code: 200,
          msg: 'success',
          result: ''
        })
      }
    }
  })    
})

// 购物车的修改
router.post('/editCheckAll', (req, res, next) => {
  let userId = req.cookies.userId,
      checkAll = req.body.checkAll ? '1' : '0'
  // 批量更新子文档    
  User.findOne({userId: userId}, (err, user) => {
    if (err) {
      res.json({
        code: 501,
        msg: err.message,
        result: ''
      })
    } else {
      if (user) {
        user.cartList.forEach(item => {
          item.checked = checkAll
        })
        user.save((err, doc) => {
          if (err) {
            res.json({
              code: 501,
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              code: 200,
              msg: 'success',
              result: ''
            })
          }
        })
      }
    }
  })
})

// 获取收货地址
router.get('/addressList', (req, res, next) => {
  let userId = req.cookies.userId
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        code: 501,
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        code: 200,
        msg: 'success',
        result: doc.addressList
      })
    }
  })
})
module.exports = router;
