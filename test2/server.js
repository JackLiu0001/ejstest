var express = require('express');
var ejs = require('ejs');
var path = require('path');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var WebpackConfig = require('./webpack.config');

var compiler = webpack(WebpackConfig);

// 创建app应用
var app = express();

//注册ejs模板为html页。简单的讲，就是原来以.ejs为后缀的模板页，现在的后缀名可以//是.html了
app.engine('.html', ejs.__express);

// 设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set('views', './src');

//设置视图模板的默认后缀名为.html,避免了每次res.Render("xx.html")的尴尬
app.set('view engine', 'html');

app.use(express.static(__dirname));

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/',
  stats: {
    colors: true
  }
}));
app.use(webpackHotMiddleware(compiler, {
	log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}));

// app.use('*', function(req, res, next) {
// 	// console.log(req);
// 	console.log('baseurl', req.baseUrl);
// 	console.log('path', req.path);
// 	next();
// });
var webshot = require('webshot');
var fs = require('fs');
app.use('*', function(req, res, next) {
	// webshot('http://res.kpns.ijinshan.com/res/20140303/139382261948529.html', './screenshot/google.png', function(err) {
	// 	// screenshot now saved to google.png 
	// 	console.log(111);
	// 	console.log(err);
	// });


	var renderStream = webshot('google.com');
	var file = fs.createWriteStream('google.png', {encoding: 'binary'});

	var imgData = '';
    renderStream.on('data', function(data) {
        file.write(data.toString('binary'), 'binary');
        imgData += data.toString('base64');
    });
    renderStream.on('end', data => {
        res.send({
            successful: true,
            message: 'test',
            data: {
                web_shot: imgData
            }
        });
    })
	next();
});












app.use('/', function (req, res, next) {

	// res.render(path.join(__dirname, 'src', 'index.html'), {isProduction: 'production'});
	res.render('index.html', {isProduction: 'development'});
});

app.listen(4000, function() {
	console.log('端口', 4000);
});