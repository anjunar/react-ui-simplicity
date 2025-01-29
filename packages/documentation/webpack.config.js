const webpack = require('webpack');
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, '../../docs'),
        clean : true,
        publicPath: "/react-ui-simplicity/"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
/*
            {
                test: /\.(tsx|ts|js|jsx|css)$/,
                use: ['source-map-loader'],
                enforce: 'pre',
            },
*/
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                type: "asset",
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devServer: {
        hot: true,
        port: 3000,
        open: true,
        historyApiFallback: true,
        proxy: [
            {
                context: ['/service'],
                target: 'http://localhost:8080',
            },
        ],
    },
    plugins: [
        new HtmlPlugin({
            template: 'public/index.html',
            filename: 'index.html'
        }),
        new ReactRefreshWebpackPlugin({
            overlay: false
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/assets', to: 'assets' },
            ],
        })
    ]
}
