const fs = require('fs');
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
    path: path.resolve('dist/webpacks'),
  },
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.js?$/],
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react'],
        },
      },
    ],
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: ['node_modules', 'src/react_components'],
  }
};

// Automatically build every file in webpack_src into a corresponding webpack_dist/*.bundle.js file
// const webpackEntryPoints = fs.readdirSync(path.resolve('webpack_src'));

// for (const entryPoint of webpackEntryPoints) {
//     moduleConfig['entry'][entryPoint] = [path.resolve(`webpack_src/${entryPoint}`)];
// }

module.exports = moduleConfig;