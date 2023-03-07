const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');
const path = require('path');

async function sharpenAndContrastImage(inputPath, outputPath) {
  // Load the image using the canvas package
  const image = await loadImage(inputPath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);

  // Convert the canvas to a buffer and create a sharp object
  const buffer = canvas.toBuffer('image/jpeg');
  const sharpImage = sharp(buffer);

  sharpImage
    .greyscale()
    .sharpen({
      sigma: 2.0,
      flat: 0.5,
    })
    .normalize();

  // Save the modified image to the output path
  await sharpImage.toFile(outputPath);

  console.log(`Image saved to ${path.resolve(outputPath)}`);
}


// Example usage
sharpenAndContrastImage('/Users/liam/Documents/GitHub/SoftwareProjects_AnimalRecognition/server/dataStore/images/1678112648110.jpg', './output.jpg');
