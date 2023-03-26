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
}

const sobel = require('sobel');

async function applySobelFilter(inputPath, outputPath) {
  // Load the image using the canvas package
  const image = await loadImage(inputPath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);

  // Apply the Sobel filter to the image data
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const sobelData = sobel(imageData);

  // Create a new canvas to draw the filtered image on
  const outputCanvas = createCanvas(image.width, image.height);
  const outCtx = outputCanvas.getContext('2d');
  const outputImage = outCtx.createImageData(image.width, image.height);

  // Copy the Sobel data to the new ImageData object
  for (let i = 0; i < sobelData.length; i++) {
    outputImage.data[i] = sobelData[i];
  }

  // Draw the filtered image on the canvas
  outCtx.putImageData(outputImage, 0, 0);

  // Save the canvas as an image file
  const stream = outputCanvas.createPNGStream();
  const fs = require('fs');
  const out = fs.createWriteStream(outputPath);
  stream.pipe(out);
  out.on('finish', () => console.log('The PNG file was created.'));
}



// Example usage
//sharpenAndContrastImage('/Users/liam/Documents/GitHub/SoftwareProjects_AnimalRecognition/SHU-dataset/sheep/sheep-09.jpg', './output.jpg');

applySobelFilter('/Users/liam/Documents/GitHub/SoftwareProjects_AnimalRecognition/SHU-dataset/sheep/sheep-05.jpg', './output.jpg');