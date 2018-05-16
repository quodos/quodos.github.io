const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs');
const filesize = require('filesize');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

const spinner = ora('Converting images to webp... 🖼\n');
spinner.color = 'green';
spinner.start();

imagemin([path.resolve(__dirname, '../dist/images/*.{jpg,png}')], path.resolve(__dirname, '../dist/images'), {
  use: [
    imageminWebp(),
  ]
}).then(files => {
  spinner.succeed('All images converted to webp! 🦄');

  const rootPath = path.resolve(__dirname, '../');

  for (let i in files) {
    const absoluteFilePath = files[i].path;
    const relativeFilePath = path.relative(rootPath, absoluteFilePath);

    const stats = fs.statSync(absoluteFilePath);

    console.log(`    [${i}] ${chalk.whiteBright.bold(relativeFilePath)} ${filesize(stats.size, { fullform: true })}`);
  }
}, error => {
  spinner.fail('Convertion error!\n', error);
});
