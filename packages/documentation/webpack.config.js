import webpack from 'webpack';
import path from 'path';
import HtmlPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export default (env) => {
    return {
        entry: './src/index.tsx',
        output: {
            filename: '[name].[contenthash].js',
            path: path.resolve('../../docs'),
            clean: true,
            publicPath: env.publicPath
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
                filename: 'index.html',
                base: env.publicPath
            }),
            new ReactRefreshWebpackPlugin({
                overlay: false
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {from: 'public/assets', to: 'assets'},
                ],
            }),
            new webpack.DefinePlugin({
                "process.env.PUBLIC_URL": JSON.stringify(env.publicPath),
            })
        ]
    }
}
