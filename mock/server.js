const jsonServer = require('json-server');
const server = jsonServer.create();

// Support middleware
const middleware = jsonServer.defaults();
server.use(middleware);

// 支持加载多个db json文件
const _ = require('underscore');
const path = require('path');
const fs = require('fs');
const mockDir = path.join(__dirname, 'data');
const base = {};
const files = fs.readdirSync(mockDir);
files.forEach(function (file) {
  _.extend(base, require(path.resolve(mockDir, file)));
});
const router = jsonServer.router(base);
server.use(router);

// 返回自定义格式数据
router.render = (req, res) => {
  res.jsonp({
    data: res.locals.data,
    code: 0,
    message: ''
  });
};

// 当请求方式为post的时候，要将数据进行转换
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

server.listen(3000, () => {
  console.log('JSON Server is running');
});
