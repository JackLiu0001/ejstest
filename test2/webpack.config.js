var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
// console.log(process.argv);
// console.log(process.env.NODE_ENV);
var NODE_ENV = process.env.NODE_ENV;
console.log(NODE_ENV);
var isProduction = (NODE_ENV == 'production' ? true : false);
var config = {
	entry: {
		'common.vendors': ['angular', 'angular-ui-router'],
		'app': ['./src/app.js', hotMiddlewareScript],
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name]' + (isProduction ? '-[hash]' : '') + '.js',
		publicPath: '/'
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
		    compressor: {
		        warnings: false,
		    },
	    }),
	    new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin(),	//这个
        new webpack.NoEmitOnErrorsPlugin(),
        new MyPlugin({options: true}),
        // webpack提供一个插件，把一个全局变量插入到所有的代码中，在config.js里面配置
        // 问题：会在app.js和common.vendors.js两个文件同时加入jquery源码，？？？？？？
	    // new webpack.ProvidePlugin({
	    //   $: "jquery",
	    //   jQuery: "jquery",
	    //   "window.jQuery": "jquery"
	    // })
		// new HtmlWebpackPlugin({
	 //      	template: './src/index.html'
	 //    })
	],
  	module: {
    	loaders: [{
    	  	test: /\.css$/,
      		loader: "style-loader!css-loader"
    	},{
      		test: /.(png|woff|woff2|eot|ttf|svg)$/,
      		loader: 'url-loader?limit=100000'
    	}]
  	}
};

function MyPlugin(options) {
	console.log(options);
  // Configure your plugin with options...
}

MyPlugin.prototype.apply = function(compiler) {
	compiler.plugin('done', function(stats) {
		if (isProduction) {
			var getHtml = fs.readFileSync(path.join(__dirname, 'src/index.html'), 'utf8');
			var distPathApp = (isProduction ? '-' + stats.hash : '') + '.js';
			html = getHtml.replace(/<script.*script>/, '<script src="./common.vendors' + distPathApp + '"></script><script src="./app' + distPathApp + '"></script>');
			fs.writeFileSync(path.join(__dirname, (isProduction ? 'dist' : 'src'), 'index.html'), html);
		}
	});
	// compiler.plugin("compile", function(params) {
	//     console.log("The compiler is starting to compile...");
	// });

	// compiler.plugin("compilation", function(compilation) {
	//     console.log("The compiler is starting a new compilation...");

	//     compilation.plugin("optimize", function() {
	//       console.log("The compilation is starting to optimize files...");
	//     });
	// });

	// compiler.plugin("emit", function(compilation, callback) {
	//     console.log("The compilation is going to emit files...");
	//     callback();
	// });
};

module.exports = config