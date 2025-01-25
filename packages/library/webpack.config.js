const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './index.ts',
    mode: "development",
    devtool: "source-map",
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build'),
        clean : true,
        library: {
            name : "react-ui-simplicity",
            type: "umd"
        },
        globalObject: "this"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
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
    }
}
