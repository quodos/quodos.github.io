const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const generateHtmlPlugins = (templatesDirectory, templateExtensions = ['html']) => {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templatesDirectory));
  return templateFiles.map(item => {
    // Split names and extension
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];

    if (!templateExtensions.includes(extension)) {
      return () => {};
    }

    return new HTMLWebpackPlugin({
      filename : `../${name}.html`,
      template : path.resolve(__dirname, `${templatesDirectory}/${name}.${extension}`),
      minify   : {
        removeComments        : true,
        collapseWhitespace    : true,
        removeAttributeQuotes : true,
      },
    })
  })
};

module.exports = generateHtmlPlugins;
