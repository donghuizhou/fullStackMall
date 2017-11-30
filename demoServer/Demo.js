let user = require('./User.js')

console.log(`userName:${user.userName}`)

console.log(`say:${user.sayHello()}`)

let http = require('http')
let url = require('url')
let util = require('util')

http.createServer((req, res) => {
  res.statusCode = 200

  res.setHeader('Content-Type', 'text/plain, charset=uutf-8')
  console.log(`url: ${req.url}`)

  res.end(util.inspect(url.parse(req.url)))
}).listen(3000, '127.0.0.1', () => {
  console.log('服务器已经运行，请打开浏览器输入 127.0.0.1:3000 来进行访问')
})
