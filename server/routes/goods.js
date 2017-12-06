let express = require('express')
let router = express.Router()
let mongoose = require('mongoose')
let Goods = require('../models/goods')

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

router.get('/', (req, res, next) => {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let sort = req.param('sort')
  let skip = (page - 1) * pageSize
  let params = {}

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})
  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: 501,
        msg: err.message
      })
    } else {
      res.json({
        status: 200,
        msg: '获取信息成功',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

module.exports = router
