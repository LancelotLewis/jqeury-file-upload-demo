var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	// devtool: 'eval-source-map', // 配置生成Source Maps，选择合适的选项
	devtool: false,
	entry: __dirname + "/app/entry.js", // 已多次提及的唯一入口文件
	output: {
		path: __dirname + "/public", // 打包后的文件存放的地方
		filename: "progress.js" // 打包后输出文件的文件名
	},

	module: {
		// webpack2中使用rules代替loaders
		rules: [{
			test: /\.css$/,
			exclude: /node_modules/,
			// loader: ['style-loader','css-loader']
			use: ExtractTextPlugin.extract({
				fallback: "style-loader",
				use: "css-loader?minimize"  // 默认不开启css的压缩，使用minimize参数进行压缩配置
			})
		},{
			// 开启es6编译
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015']
			}
		}]
	},

	plugins: [
		new webpack.DefinePlugin({
			"process.env": { 
				NODE_ENV: JSON.stringify("production") 
			}
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: true,
			hash: true,
			minify: {
				removeComments: true,
				// collapseWhitespace: true,
				// removeAttributeQuotes: true
		 }
		}),
		new ExtractTextPlugin("progress.css"),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_debugger: true,
				// 去除console
				drop_console: true
			}
		}),
	]
}