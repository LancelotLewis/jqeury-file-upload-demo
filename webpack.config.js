var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	// devtool: 'eval-source-map', // 配置生成Source Maps，选择合适的选项
	devtool: false,
	entry: __dirname + "/app/entry.js", // 已多次提及的唯一入口文件
	output: {
		path: __dirname + "/public", // 打包后的文件存放的地方
		filename: "bundle.js" // 打包后输出文件的文件名
	},

	module: {
		rules: [{
			test: /\.css$/,
			exclude: /node_modules/,
			loader: ['style-loader','css-loader']
			// use: ExtractTextPlugin.extract({
			// 	fallback: "style-loader",
			// 	use: "css-loader"
			// })
		}]
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(), // 热加载插件
		new webpack.DefinePlugin({
			"process.env": { 
				NODE_ENV: JSON.stringify("production") 
			}
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: true
		}),
		new webpack.NamedModulesPlugin()
	],

	/**
	 * [devServer 配置webpack server]
	 * @type {Object}
	 * 可设置脚本更改页面实时刷新（局限于部分文件，改部分js的时候页面需要强制刷新才能进行更新，但更新css文件这种就可以无刷新更新）
	 */
	devServer: {
		port: 8000,
		// contentBase: "//cdn.bootcss.com/public", // 本地服务器所加载的页面所在的目录
		contentBase: "/app", // 本地服务器所加载的页面所在的目录
		historyApiFallback: true, // 不跳转
		inline: true, // 实时刷新
		hot: true,
		stats: true,
		// noInfo: true,
	}
}