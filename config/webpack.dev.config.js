const base = require('./webpack.base.config');

module.exports = base({
  isProduction: false,
  devtool: 'cheap-eval-source-map',
  port: 1337,
  mode: 'development'
});
