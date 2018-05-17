/* eslint-env node */

'use strict';

const path = require('path');
const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ExtractSASS = new ExtractTextPlugin('css/[hash].app.css');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const generateHtmlPlugins = require('../helpers/generateHtmlPlugins');

const HtmlPlugins = generateHtmlPlugins('../src');

module.exports = (options) => {
  const dest = path.join(__dirname, '../build');

  let webpackConfig = {
    mode: options.mode,
    devtool: options.devtool,
    entry: [
      './src/js/index'
    ],
    output: {
      path: dest,
      filename: 'js/[hash].app.js'
    },
    plugins: [
      new Webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(options.isProduction ? 'production' : 'development')
        }
      }),
      new CleanWebpackPlugin([
        path.resolve(__dirname, '../build/css'),
        path.resolve(__dirname, '../build/js'),
        path.resolve(__dirname, '../*.html'),
      ], {
        root: path.resolve(__dirname, '../'),
      }),
      // new HtmlWebpackPlugin({
      //   template : './src/index.html',
      //   filename : '../index.html',
      //   favicon  : 'favicon.ico',
      //   minify   : {
      //     removeComments        : true,
      //     collapseWhitespace    : true,
      //     removeAttributeQuotes : true
      //   },
      // }),
      new CopyWebpackPlugin([
        {
          test : /\.(jpe?g|png)$/i,
          from : path.resolve(__dirname, '../src/images'),
          to   : 'images',
        }
      ]),
      // new ImageminPlugin({
      //   disable : options.mode !== 'production', // Disable during development
      //   test    : 'images/*.{jpg,png}',
      //   plugins : [
      //     ImageminWebp({
      //       lossless: true,
      //     })
      //   ]
      // }),
    ].concat(HtmlPlugins),
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [[
              'env',
              {
                'targets': {
                  'browsers': [
                    'last 2 versions',
                    'ie >= 11'
                  ]
                },
                'useBuiltIns': true
              }
            ]]
          }
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
        use: [
          {
            loader  : 'file-loader',
            options : {
              name: 'images/[name].[ext]',
            }
          },
        ]
      }]
    }
  };

  if (options.isProduction) {
    webpackConfig.entry = ['./src/js/index'];

    webpackConfig.plugins.push(
      new UglifyJSPlugin({
        sourceMap: true,
      }),
      ExtractSASS,
    );

    webpackConfig.plugins.push(
      new WebpackShellPlugin({
        onBuildEnd: [
          'git add build/*',
        ],
      }),
    );

    webpackConfig.module.rules.push({
      test : /\.s?css/i,
      use  : ExtractSASS.extract(['css-loader?sourceMap=true&minimize=true', 'sass-loader'])
    });

  } else {
    webpackConfig.plugins.push(
      new Webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template : 'src/index.html',
        favicon  : 'favicon.ico',
      }),
    );

    webpackConfig.module.rules.push({
      test : /\.s?css$/i,
      use  : ['style-loader', 'css-loader?sourceMap=true', 'sass-loader'],
    }, {
      test    : /\.js$/,
      use     : 'eslint-loader',
      exclude : /node_modules/,
    });

    webpackConfig.devServer = {
      contentBase : path.resolve(__dirname, '../src'),
      hot         : true,
      port        : options.port,
      inline      : true,
    };
  }

  return webpackConfig;
};
