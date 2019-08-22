const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CopyPlugin([
      // { from: 'src/models', to: 'models' },
      // { from: 'src/libs', to: 'libs' },
    ]),
  ],
  performance: { 
    // hints: false,
    maxEntrypointSize: 5120000,
    maxAssetSize: 5120000
  }
});