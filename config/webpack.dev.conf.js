const utils = require('./utils');
const path = require('path');
const webpack = require('webpack');
const config = require('./baseConfig');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

function resolveApp(relativePath) {
    return path.resolve(relativePath);
}
module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.dev.cssSourceMap
        })
    },
    devtool: '#cheap-source-map',
    cache: true,
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NamedModulesPlugin(),
        // new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            favicon: resolveApp('favicon.ico'),
            inject: true,
            path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory
        }),
        new FriendlyErrorsPlugin(),
        new OpenBrowserPlugin({
            url: 'http://test.wx.tnyxg.cn:88'
        })
    ]
});

