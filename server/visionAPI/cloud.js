// *** key.json must be placed inside directory to use ***

const path = require('path');

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
    
// Creates a client
key = path.join(__dirname, '../../key.json');
const client = new vision.ImageAnnotatorClient({
    keyFilename: key
});    

// Path to users images
const userImagePath = path.join(__dirname, '../../client/public/userImages/');
const fs = require("fs");

// Setup array format and put the image in
async function readDirectory(userImagePath, imageArr) {
    const currentDate = new Date();
    return new Promise((resolve, reject) => {
        fs.readdir(userImagePath, (err, files) => {
            if (err) reject(err);
            files.forEach(file => {
                if (file !== ".gitkeep") {
                    imageArr.push({
                        path: file, 
                        date: currentDate,
                        containsAnimal: true,
                        labels: []
                    });
                }
            });
            resolve();
        });
    });
};

// Compares to animals.json
function checkLabelsForAnimal(labels) {
    const animals = JSON.parse(fs.readFileSync(path.join(__dirname, 'animals.json'), 'utf8'));
    const animalLabels = labels.filter(label => {
        for (let animal of animals) {
            if (label.description === animal) {
                return animal; // return the animal label when a match is found
            }
        }
    });
    return animalLabels.length > 0 ? animalLabels[0] : null; // return the first animal label found, or null if no matches
};
  

// Return formatted array with labels
async function getImageLabels() {
    
    var labelData = [];
    await readDirectory(userImagePath, labelData);

    for (let image of labelData) {

        // Scan each image in public/userImages, add labels to array and bool
        const [result] = await client.labelDetection(path.join(userImagePath, image.path));
        const labels = result.labelAnnotations.map(label => ({ ...label, userThinksValid: true }));

        // check if animal is in image and update bool if not
        image.labels = labels;
        if (checkLabelsForAnimal(labels) === null) {
            image.containsAnimal = false
        };
        console.log('Image contains animal:', image.containsAnimal);
    };
    
    return labelData;
};

// Object Detection -----------------------------------------------------------

const { createCanvas, loadImage } = require('canvas');

async function objectDetection(imageName) {
    console.log('Detecting objects in:', imageName);
    const fileName = path.join(userImagePath, imageName);
    const request = {
        image: {content: fs.readFileSync(fileName)},
    };
  
    const [result] = await client.objectLocalization(request);
    const objects = result.localizedObjectAnnotations;
  
    // create canvas
    await drawBoxes(imageName, objects);

    //console.log('Objects detected:', objects);

    return objects;
};
  
async function drawBoxes(imageName, objects) {
  
    // Load image and create canvas
    const fileName = path.join(userImagePath, imageName);
    const image = await loadImage(fileName);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
  
    // Draw image on canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
    // Draw boxes on canvas for each object
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      const vertices = object.boundingPoly.normalizedVertices;
  
      ctx.beginPath();
      ctx.lineWidth = "4";
      ctx.strokeStyle = "red";
      ctx.rect(vertices[0].x * canvas.width, vertices[0].y * canvas.height, (vertices[1].x - vertices[0].x) * canvas.width, (vertices[2].y - vertices[0].y) * canvas.height);
      ctx.stroke();
  
      // Add name and score to top left of bounding box
      ctx.fillStyle = "red";
      ctx.font = "Bold 15px Arial";
      ctx.fillText(`${object.name}: ${object.score.toFixed(2)}%`, vertices[0].x * canvas.width, vertices[0].y * canvas.height - 5);
    }
  
    // Save new image with boxes
    return new Promise((resolve, reject) => {
        // Save new image with boxes
        const out = fs.createWriteStream(`${userImagePath}object_${imageName}`);
        const stream = canvas.createJPEGStream({
            quality: 0.95,
            chromaSubsampling: false,
        });
        stream.pipe(out);

        out.on('finish', () => {
            console.log('Object boxes drawn on:', imageName);
            resolve();
        });

        out.on('error', (error) => {
            reject(error);
        });
    })
};

// Compares to animals.json
async function checkObjectsForHazards(objects) {
    const hazards = new Set(JSON.parse(await fs.promises.readFile(path.join(__dirname, 'hazards.json'), 'utf8')));
    const hazardsInObject = objects.filter(obj => hazards.has(obj.name)).map(obj => obj.name);
    console.log('Hazards found in object: ', hazardsInObject);
    return hazardsInObject;
};


// Export functions 
module.exports = {
    getImageLabels,
    checkLabelsForAnimal,
    objectDetection,
    checkObjectsForHazards
};

