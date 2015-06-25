var webpack = require('webpack')

module.exports = {
  entry: './example/index.js',
  output: {
    path: './example',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel?stage=0'
      }
    ]
  }
}
