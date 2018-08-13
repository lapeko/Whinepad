'use strict'

const NODE_ENV = process.env.NODE_ENV
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const path = require('path')
const AssetsPlugin = require('assets-webpack-plugin')

let conf = {
	context: path.resolve(__dirname, 'src'),
	entry: {
		index: './App',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: /*NODE_ENV == 'development' ?*/ '[name].js'/* : '[name].[chunkhash].js'*/,
		chunkFilename: NODE_ENV == 'development' ? '[id].js' : '[id].[chunkhash].js',
		publicPath: '/dist/',
		library: '[name]'
	},
	mode: NODE_ENV,
	resolve: {
		modules: ['node_modules'],
		extensions: ['.js', '.sass']
	},
	resolveLoader: {
	    modules: ["node_modules"],
	    moduleExtensions: ['-loader'],
        extensions: [".js"]
    },
	plugins: [
		new webpack.DefinePlugin({
			NODE_ENV: JSON.stringify(NODE_ENV)
		}),
		new ExtractTextPlugin(
			/*NODE_ENV == 'development' ? */'./css/main.css'/* : './css/main.[hash].css'*/,
			{allChunks: true, disable: NODE_ENV == 'development'}
		),
		new AssetsPlugin({
			filename: 'assets.json',
			path: path.resolve(__dirname, 'dist')
		}),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel',
				include: path.resolve(__dirname, 'src')
			},{
				test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
				exclude: /\/node_modules\//,
				loader: 'file?name=[path][name].[ext]'
            },{
            	test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
				include: /\/node_modules\//,
				loader: NODE_ENV == 'development'
					? 'url?name=[1].[ext]&regExp=node_modules/(.*)'
					: 'url?name=[1].[hash:6].[ext]&regExp=node_modules/(.*)'
            }
		]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				'commons': {
					test: /\.sass$|\.css$/,
					name: 'commons'
				},
			},
		},
	},
	devServer: {
		contentBase: path.resolve(__dirname, 'public')
	}
}

if (NODE_ENV == 'production'){
	conf.optimization = {minimizer: [
		new (require('uglifyjs-webpack-plugin'))({
			uglifyOptions: {
				compress: {
					warnings: false,
					drop_console: true,
					unsafe: true
				}
			}
		})
	]}
}

module.exports = (ens, options) => {
	NODE_ENV === 'development'
		?	conf.module.rules.push({
			test: /\.sass$/,
				use: [
					'style',
		            'css',
		            'postcss?plugins: [autoprefixer({browsers:["ie >= 8", "last 4 version"]})]&sourceMap: true}',
		        	'sass'
		    	]
			})
		: 	conf.module.rules.push({
				test: /\.sass$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style',
					use: [
			            'css',
			            'postcss?plugins: [autoprefixer({browsers:["ie >= 8", "last 4 version"]})]&sourceMap: true}',
			        	'sass'
			    	]
				})
			})

	return conf
}