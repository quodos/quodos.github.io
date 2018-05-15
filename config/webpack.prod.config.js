const base = require('./webpack.base.config');

module.exports = base({
  isProduction: true,
  devtool: 'source-map',
  mode: 'production'
});
