var express = require('express');
var router = express.Router();
let User = require('./../models/user.js')
require('./../util/ulit')

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

// 设置默认地址
router.post('/setDefault', (req, res, next) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  if (!addressId) {
    res.json({
      code: 501,
      msg: '请输入addressId',
      result: ''
    })
  } else {
    User.findOne({userId: userId}, (err, doc) => {
      if (err) {
        res.json({
          code: 501,
          msg: err.message,
          result: ''
        })
      } else {
        let addressList = doc.addressList
        addressList.forEach(item => {
          if (item.addressId == addressId) {
            item.isDefault = true
          } else {
            item.isDefault = false
          }
        })
        doc.save((err2, doc2) => {
          if (err2) {
            res.json({
              code: 501,
              msg: err2.message,
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
    })
  }
})

// 删除地址
router.post('/delAddress', (req, res, next) => {
  let userId = req.cookies.userId,
      addressId = req.body.addressId
  User.update({
    userId: userId
  }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }}, (err, doc) => {
      if (err) {
        res.json({
          code: 501,
          msg: err.message,
          result: ''
        })
      } else {
        res.json({
          code: 200,
          msg: 'del success',
          result: ''
        })
      }
  })
})

// 创建订单
router.post('/payMent', (req, res, next) => {
  let userId = req.cookies.userId,
      addressId = req.body.addressId,
      orderTotal = req.body.orderTotal
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        code: 501,
        msg: err.message,
        result: ''
      })
    } else {
      let address = '',
          goodsList = []
      // 获取当前用户的地址信息
      doc.addressList.forEach(item => {
        if (item.addressId === addressId) {
          address = item
        }
      })
      // 获取用户购物车的商品
      doc.cartList.filter(item => {
        if (item.checked == 1) {
          goodsList.push(item)
        }
      })

      let platform = '622'
      let r1 = Math.floor(Math.random() * 10)
      let r2 = Math.floor(Math.random() * 10)
      let sysDate = new Date().Format('yyyyMMddhhmmss')
      let createDate =  new Date().Format('yyyy-MM-dd hh:mm:ss')
      let orderId = platform + r1 + sysDate + r2

      let order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsLIst: goodsList,
        orderStatus: '1',
        creatDate: createDate
      }
      doc.orderList.push(order)
      doc.save((err1, doc1) => {
        if (err1) {
          res.json({
            code: 501,
            msg: err1.message,
            result: ''
          })
        } else {
          res.json({
            code: 200,
            msg: 'success',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        }
      })
    }
  })    
})

// 根据订单id查询订单信息
router.get('/orderDetail', (req, res, next) => {
  let userId = req.cookies.userId,
      orderId = req.query.orderId
  User.findOne({userId: userId}, (err, userInfo) => {
    if (err) {
      res.json({
        code: 501,
        msg: err.message,
        result: ''
      })
    } else {
      let orderList = userInfo.orderList
      if (!orderList.length) {
        res.json({
          code: 501,
          msg: '无此订单',
          result: ''
        })
      } else {
        let orderTotal = 0
        orderList.forEach(item => {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal
          }
        })
        if (orderTotal == 0) {
          res.json({
            code: 501,
            msg: '无此订单',
            result: ''
          })
        } else {
          res.json({
            code: 200,
            msg: 'success',
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          })
        }
      }
    }
  })
})

// 查询购物车商品数量
router.get('/getCartCount', (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId
    User.findOne({userId: userId}, (err, doc) => {
      if (err) {
        res.json({
          code: 501,
          msg: err.message,
          result: ''
        })
      } else {
        let cartList = doc.cartList,
            cartCount = 0
        cartList.map(item => {
          cartCount += parseInt(item.productNum)
        })
        res.json({
          code: 200,
          msg: '',
          result: cartCount
        })
      }
    })
  } 
})
module.exports = router;
