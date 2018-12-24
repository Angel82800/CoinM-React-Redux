'use strict';

/**
 * Default dev server configuration.
 */
const webpack = require('webpack');
const WebpackBaseConfig = require('./Base');
const Dotenv = require("dotenv-webpack");
let WebpackAutoInject = require('webpack-auto-inject-version');

class WebpackDevConfig extends WebpackBaseConfig {

    constructor() {
        super();
        this.config = {
            devtool: 'cheap-module-source-map',
            entry: [
                'webpack-dev-server/client?http://0.0.0.0:8000/',
                'webpack/hot/only-dev-server',
                'react-hot-loader/patch',
                './client.js'
            ],
            plugins: [
                new WebpackAutoInject({
                    components: {
                        AutoIncreaseVersion: false
                    },
                    componentsOptions: {
                        AutoIncreaseVersion: {
                            runInWatchMode: false // it will increase version with every single build!
                        },
                        InjectAsComment: {
                            tag: 'Version: {version} - {date}',
                            dateFormat: 'h:MM:ss TT'
                        },
                        InjectByTag: {
                            fileRegex: /\.+/,
                            dateFormat: 'h:MM:ss TT'
                        }
                    }
                }),
                new webpack.HotModuleReplacementPlugin(),
                new webpack.NoEmitOnErrorsPlugin(),
//                new webpack.ProvidePlugin({
//                    $: "jquery",
//                    jQuery: "jquery",
//                    "window.jQuery": "jquery"
//                }),
                new Dotenv({
                    path: './.env',
                    safe: true
                })
            ]
        };

        this.config.module.rules.push(
            {
                test: /^.((?!cssmodule).)*\.(sass|scss)$/,
                loaders: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    { loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        )
    }
}

module.exports = WebpackDevConfig;
