var webpack = require('webpack')

module.exports = {
  entry: ['./docs/index.js', 'babel-polyfill'],
  output: {
    path: './docs',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
}
