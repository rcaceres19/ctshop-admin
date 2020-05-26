const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/main.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.(css|sass|scss)$/,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader'
          ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?.*$|$)/,
        loader: 'file-loader',
        options: {
          outputPath: 'images',
        },
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
      }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('css/mystyles.css'),
    new Dotenv()
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    hot: true
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({
      uglifyOptions: {
        sourceMap: true,
        compress: {
          drop_console: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          dead_code: true,
          if_return: true,
          join_vars: true
        },
        output: {
          comments: false
        }
      }
    })],
  },
};