const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: "./src/index.tsx",

    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "build"),
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                exclude: /node_modules/,
                loader: "ts-loader"
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName:'[name]__[local]--[hash:base64:5]',
                            },
                        },
                    },
                ],
            },
        ],
    },

    resolve: {
        alias: {
            "@utils": path.resolve(__dirname, 'src/utils'),
            "@components": path.resolve(__dirname, 'src/components'),
            "@shared": path.resolve(__dirname, 'src/components-shared'),
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@selectors": path.resolve(__dirname, "src/redux/selectors"),
            "@slices": path.resolve(__dirname, "src/redux/slices"),
            "@constants": path.resolve(__dirname, "src/constants.ts")
        },
        extensions: [".*", ".js", ".jsx", ".ts", ".tsx"],
    },

    // Webpack Plugins
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public", "index.html"),
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/default.css' },
            ]
        }),
        new MiniCssExtractPlugin(),
    ],

    // Webpack Dev Server Configuration
    devServer: {
        static: {
            directory: path.join(__dirname, "build"),
        },
        port: 3000,
        liveReload: true, // watch for changes in the content base directory
        open: true, // open the default browser when webpack starts
    }
};
