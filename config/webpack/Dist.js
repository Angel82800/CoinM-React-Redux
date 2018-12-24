'use strict';

/**
 * Dist configuration. Used to build the
 * final output when running npm run dist.
 */
const webpack = require('webpack');
const WebpackBaseConfig = require('./Base');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require("dotenv-webpack");
let WebpackAutoInject = require('webpack-auto-inject-version');

const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [ROOT].concat(args));
}

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

class WebpackDistConfig extends WebpackBaseConfig {

    constructor() {
        super();
        this.config = {
            cache: false,
            devtool: 'source-map',
            entry: [
                './client.js'
            ],
            output: {
                path: root('dist'),
                publicPath: '/',
                filename: 'assets/app.js',
                chunkFilename: 'assets/[id].[hash].chunk.js'
            },
            plugins: [
                new WebpackAutoInject({
                    components: {
                        AutoIncreaseVersion: false
                    },
                    SILENT: true,
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
          //      new webpack.DefinePlugin({
          //           'process.env.NODE_ENV': JSON.stringify('production')
          //        }),
                new UglifyJSPlugin(),
                new webpack.optimize.AggressiveMergingPlugin(),
                new webpack.NoEmitOnErrorsPlugin(),
//                new webpack.ProvidePlugin({
//                    $: "jquery",
//                    jQuery: "jquery",
//                    "window.jQuery": "jquery"
//                }),
                new CopyWebpackPlugin([
                    {from: root('src/favicon'), to: root('dist/favicon') },
                    {from: root('src/vendors'), to: root('dist/vendors') },
                //    {from: root('src/assets/images'), to: root('dist/assets/images') },
                    {from: root('src/assets'), to: root('dist/assets') },
                ]),
                new Dotenv({
                    path: './.env',
                    safe: true
                })
            ]
        };

        // Deactivate hot-reloading if we run dist build on the dev server
        this.config.devServer.hot = false;

        this.config.module.rules.push(
            {
                test: /^.((?!cssmodule).)*\.(sass|scss)$/,
                loaders: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ]
            }
        )
    }

    /**
     * Get the environment name
     * @return {String} The current environment
     */
    get env() {
        return 'dist';
    }
}

module.exports = WebpackDistConfig;
