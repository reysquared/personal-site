const glob = require('glob');
const path = require('path');

const moduleConfig = {
  // TODO|kevin this is newly added, make sure it actually works right...
  // glob.sync returns an array of filenames
  entry: glob.sync('./src/webpacks/**.jsx').reduce(function (obj, el) {
      obj[path.basename(el, '.jsx')] = el;
      return obj
    }, {}),
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/webpacks'),
  },
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
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: ['node_modules', 'src'],
  }
};

module.exports = moduleConfig;