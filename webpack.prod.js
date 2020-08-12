const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
// const CopyPlugin = require('copy-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    // new BundleAnalyzerPlugin(),
    // new CopyPlugin({
    //   patterns: [
    //     { from: 'src/models', to: 'models' },
    //     { from: 'src/libs', to: 'libs' },
    //   ],
    // }),
  ],
  performance: { 
    // hints: false,
    maxEntrypointSize: 5120000,
    maxAssetSize: 5120000
  }
});