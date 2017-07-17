var HtmlWebpackPlugin = require('html-webpack-plugin');
var StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var webpack = require('webpack');


module.exports = {
    devtool: '#source-map',
    entry: './src/build.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: StyleExtHtmlWebpackPlugin.inline() }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'body',
            cache: false,
            template: 'src/template.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true
            }
        }),
        new StyleExtHtmlWebpackPlugin({
            minify: true
        }),
        new UglifyJSPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};
