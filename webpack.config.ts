import * as webpack from 'webpack';
import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

const config: webpack.Configuration = {
	entry: {
		'dist/app': './client/app.ts',
		'dist/vendor': ['three']
	},
	devtool: 'source-map',
	resolve: {
		extensions: ['.js', '.ts', '.css']
	},
	output: {
		path: __dirname,// path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		publicPath: '/' // need this for static assests to work
	},
	module: {
		rules: [
			// {
			// 	test: /\.css$/,
			// 	use: ['style-loader', 'css-loader']
			// },
			{ test: /\.ts$/, use: 'awesome-typescript-loader' }
		]
	},
	plugins: [
		/**
		 * Splits out common modules shared between entry points
		 * into a separate file. Naming the chunk the same
		 * as the vendor entry above seems to result in an isolated
		 * libary bundle since the common modules between vendor
		 * and app == vendor.
		 */
		new webpack.optimize.CommonsChunkPlugin({
			name: 'dist/vendor',
			minChunks: Infinity
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'client/index.tpl.html'),
			inject: 'body'
		})
	]
};

module.exports = config;