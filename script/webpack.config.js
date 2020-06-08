
const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    mode: "development",
    entry: './main.jsx',
    output: {
        path: '/build/static',
        filename: 'script.js',
    },
    plugins: [new MiniCssExtractPlugin({
        filename: 'style.css',
    })],
    module: { rules: [
        {
            test: /\.jsx$/,
            exclude: /node_modules/,
            use: [
                'babel-loader',
            ]
        },
        {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [
                MiniCssExtractPlugin.loader,
                { loader: 'css-loader', options: { url: false, import: false } },
                'postcss-loader',
            ]
        },
    ]},
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: { comments: false }
                },
            }),
            new OptimizeCSSAssetsPlugin(),
        ],
    },
    stats: { children: false },
};
