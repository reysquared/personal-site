const glob = require('glob');
const path = require('path');

const moduleConfig = {
  // glob.sync returns an array of filenames, this way we can create an entry
  // point dynamically for every .jsx file in /webpacks, for a multi-page app
  entry: glob.sync('./src/webpacks/**.jsx').reduce(function (obj, el) {
      obj[path.basename(el, '.jsx')] = el;
      return obj;
    }, {}),
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/webpacks'),
  },

  devServer: {
    compress: true,
    headers: [
      {
        key: 'X-Clacks-Overhead',
        value: 'GNU Terry Pratchett',
      }
    ],
    liveReload: false,
    magicHtml: false,
    port: 8080,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.js?$/],
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env', '@babel/react'],
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src'),
    ],
  }
};

module.exports = moduleConfig;