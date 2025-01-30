const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './index.ts',
    mode: "development",
    devtool: "source-map",
    target: 'node',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build'),
        clean : true,
        library: {
            type: "module"
        },
        globalObject: "this"
    },
    experiments: {
        outputModule: true,
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
    },
    externals: [nodeExternals({
        modulesDir: path.resolve(__dirname, "../../node_modules")
    })]
}
