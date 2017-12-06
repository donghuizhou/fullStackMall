let mongoose = require('mongoose')
let Schema = mongoose.Schema

// 定义模型，  模型字段：模型类型
let productSchema = new Schema({
  "productId":String,
  "productName":String,
  "salePrice":Number,
  "productImage":String
})

// 模型输出
module.exports = mongoose.model('Goods', productSchema)

