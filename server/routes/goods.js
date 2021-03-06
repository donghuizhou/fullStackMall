let express = require('express')
let router = express.Router()
let mongoose = require('mongoose')
let Goods = require('../models/goods')

mongoose.Promise = global.Promise
// 链接MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/dumall', {useMongoClient: true})

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected success')
})

mongoose.connection.on('error', () => {
  console.log('MongoDB connected fail')
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connected disconnected')
})

// 查询商品列表数据
router.get('/list', (req, res, next) => {
  let page = parseInt(req.query.page)
  let pageSize = parseInt(req.query.pageSize)
  let priceLevel = req.query.priceLevel
  let sort = req.query.sort
  let skip = (page - 1) * pageSize
  let priceGt = '', priceLte = ''
  let params = {}
  if (priceLevel !== 'all') {
    switch (priceLevel) {
      case '0': priceGt = 0; priceLte = 100; break;
      case '1': priceGt = 100; priceLte = 500; break;
      case '2': priceGt = 500; priceLte = 1000; break;
      case '3': priceGt = 1000; priceLte = 5000; break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})
  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        code: 501,
        msg: err.message
      })
    } else {
      res.json({
        code: 200,
        msg: '获取信息成功',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

// 加入到购物车
router.post('/addCart', (req, res, next) => {
  let userId = '100000077', 
      productId = req.body.productId
  let User = require('./../models/user.js')      // 获取模型
  
  User.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({
        code: 501,
        msg: err.msg
      })
    } else {
      if (userDoc) {
        let goodsItem = ''
        userDoc.cartList.forEach(item => {
          if (item.productId == productId) {
            console.log('before:' + item.productNum)
            goodsItem = item
            item.productNum++
          }
        })
        if (goodsItem) {
          userDoc.save((err2, doc2) => {
            if (err2) {
              res.json({
                code: 501,
                msg: err2.msg
              })
            } else {
              res.json({
                code: 200,
                msg: '添加成功',
                result: 'success'
              })
            }
          })
        } else {
          Goods.findOne({productId: productId}, (err1, doc) => {
            if (err1) {
              res.json({
                code: 501,
                msg: err1.msg
              })
            } else {
              if (doc) {
                doc.productNum = 1
                doc.checked = 1
                userDoc.cartList.push(doc)
                userDoc.save((err2, doc2) => {
                  if (err2) {
                    res.json({
                      code: 501,
                      msg: err2.msg
                    })
                  } else {
                    res.json({
                      code: 200,
                      msg: '添加成功',
                      result: 'success'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})

module.exports = router
