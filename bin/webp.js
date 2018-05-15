const path = require('path');
const ora = require('ora');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

const spinner = ora('Converting images to webp...');
spinner.color = 'green';
spinner.start();

imagemin([path.resolve(__dirname, '../dist/images/*.{jpg,png}')], path.resolve(__dirname, '../dist/images'), {
  use: [
    imageminWebp({
      lossless: true,
    })
  ]
}).then(() => {
  spinner.succeed('All images converted to webp! 🦄\n');
});
