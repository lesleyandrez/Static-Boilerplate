const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

module.exports = {
    entry: './src/js/main.js',
    output: {
        path: path.resolve(__dirname, './src/js-bundle'),
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.h(tml|bs)$/,
                loader: 'handlebars-loader',
                exclude: /node_modules/
            },
        ]
    },
    devtool: '#eval-source-map',
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
}
if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new HtmlWebpackPlugin({
            title: 'PRODUCTION prerender-spa-plugin',
            template: 'src/index.hbs',
            filename: path.resolve(__dirname, 'dist/index.html'),
        }),
        new PrerenderSPAPlugin({
            staticDir: path.join(__dirname, 'dist'),
            routes: ['/', '/about', '/contact'],

            renderer: new Renderer({
                headless: false,
                renderAfterDocumentEvent: 'render-event'
            })
        })
    ])
} else {
    // NODE_ENV === 'development'
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        new HtmlWebpackPlugin({
            title: 'DEVELOPMENT prerender-spa-plugin',
            template: './src/index.hbs',
            filename: path.resolve(__dirname, 'src/index.html'),
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            server: { baseDir: ['src'] }
        })
    ])
}