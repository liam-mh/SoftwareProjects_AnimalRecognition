const { saveImageToFirebaseStorage } = require('../dataStore/firebase');
const fs = require("fs");

// Connect to API
const path = require('path');
const vision = require('@google-cloud/vision');
key = path.join(__dirname, '../../key.json');
const client = new vision.ImageAnnotatorClient({
    keyFilename: key
});    

// Path to users images
const userImagePath = path.join(__dirname, '../../client/public/userImages/');

// Setup array format and put the image name in
async function readDirectory(userImagePath) {
    const array = [];
    const currentDate = new Date();
    return new Promise(async (resolve, reject) => {
        try {
            const files = await fs.promises.readdir(userImagePath);
            for (const file of files) {
                if (file !== ".gitkeep") {
                    array.push({
                        path: file, 
                        url: [],
                        date: currentDate,
                        containsAnimal: [false],
                        labels: [],
                        objectDetection: []
                    });
                }
            }
            resolve(array);
        } catch (err) {
            reject(err);
        }
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
// Compares to labelValidation.json
async function checkIfLabelIsValidForAnimal(animal, label) {
    const validLabels = JSON.parse(await fs.promises.readFile(path.join(__dirname, 'labelValidation.json'), 'utf8'));
    for (let animalObject of validLabels) {
        const animalName = Object.keys(animalObject)[0];
        if (animalName === animal) {
            for (let value of animalObject[animalName]) {
                if (value === label) {
                    return true;
                }
            }
            // If the label was not found in the animalObject
            return false;
        }
    }
    // If the animal was not found in the validLabels
    return false;
};


// Scan for labels and update containsAnimal
async function getImageLabels(array) {

    for (let image of array) {

        // Scan each image in public/userImages, add labels to array and bool
        const [result] = await client.labelDetection(path.join(userImagePath, image.path));
        image.labels = result.labelAnnotations.map(label => ({ 
            ...label, 
            userThinksCorrect: true, 
            validAgainstList: false 
        }));

        // Check if animal is in image
        const animalLabel = checkLabelsForAnimal(image.labels);
        if (animalLabel !== null) {
            array[0].containsAnimal = ([true, animalLabel.description, animalLabel.score]);
            // Update label relevance to animal
            for (let label of image.labels) {
                label.validAgainstList = await checkIfLabelIsValidForAnimal(animalLabel.description, label.description);
            }
        }

        console.log('Image contains animal:', image.containsAnimal);
    };
    
    return array;
};

// Object Detection -----------------------------------------------------------

const { createCanvas, loadImage } = require('canvas');

async function objectDetection(array) {

    for (let image of array) {

        console.log('Detecting objects in:', image.path);
        const fileName = path.join(userImagePath, image.path);
        const request = {
            image: {content: fs.readFileSync(fileName)},
        };
        const [result] = await client.objectLocalization(request);
        const objects = result.localizedObjectAnnotations;
    
        // Check for hazards and animals
        const animals = await checkObjectsForAnimals(objects);
        const hazards = await checkObjectsForHazards(objects);
        objects.forEach(obj => {
            obj.containsAnimal = animals.includes(obj.name) ? 'true' : 'false';
            obj.containsHazard = hazards.includes(obj.name) ? 'true' : 'false';
        });

        // add objects to array
        image.objectDetection = objects;

        // Create new image with highlighted objects
        await drawBoxes(image.path, objects);
    };

    return array;
};
  
async function drawBoxes(imageName, objects) {
  
    // Load image and create canvas
    const fileName = path.join(userImagePath, imageName);
    const image = await loadImage(fileName);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Calculate font and box size for image pixels
    const lineWidth = Math.round(canvas.width * 0.004);
    const fontSize = Math.round(canvas.height * 0.03);

    // Draw boxes on canvas for each object
    for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        const vertices = object.boundingPoly.normalizedVertices;
        
        let boxColor = "rgba(0, 0, 0, 0";
        ctx.fillStyle = "rgba(0, 0, 0, 0)";

        if (object.containsAnimal === 'true') {
            boxColor = "#ff00fb";
        }
        if (object.containsHazard === 'true') {
            boxColor = "red";
            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        } 

        // Draw box
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = boxColor;
        ctx.rect(
            vertices[0].x * canvas.width,
            vertices[0].y * canvas.height,
            (vertices[1].x - vertices[0].x) * canvas.width,
            (vertices[2].y - vertices[0].y) * canvas.height
        );
        ctx.stroke();
        ctx.fillRect(
            vertices[0].x * canvas.width,
            vertices[0].y * canvas.height,
            (vertices[1].x - vertices[0].x) * canvas.width,
            (vertices[2].y - vertices[0].y) * canvas.height
        );

        // Add object and score
        ctx.fillStyle = boxColor;
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillText(
            `${object.name} (${object.score.toFixed(2)*100}%)`,
            vertices[0].x * canvas.width, 
            vertices[0].y * canvas.height - fontSize/4
        );
    }
  
    // Save new image with boxes
    return new Promise((resolve, reject) => {
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

// Compares to hazards.json
async function checkObjectsForHazards(objects) {
    const hazards = new Set(JSON.parse(await fs.promises.readFile(path.join(__dirname, 'hazards.json'), 'utf8')));
    const hazardsInObject = objects.filter(obj => hazards.has(obj.name)).map(obj => obj.name);
    console.log('Hazards found in object: ', hazardsInObject);
    return hazardsInObject;
};
// Compares to animals.json
async function checkObjectsForAnimals(objects) {
    const animals = new Set(JSON.parse(await fs.promises.readFile(path.join(__dirname, 'animals.json'), 'utf8')));
    const animalsInObject = objects.filter(obj => animals.has(obj.name)).map(obj => obj.name);
    console.log('Animals found in object: ', animalsInObject);
    return animalsInObject;
};

async function scanImages() {
    try {
        data = await readDirectory(userImagePath);
        data = await getImageLabels(data);
        data = await objectDetection(data);
        for (let image of data) {
            image.url[0] = await saveImageToFirebaseStorage(image.path);
            image.url[1] = await saveImageToFirebaseStorage('object_'+image.path);
        }
        //console.log(data);
        return data;
    } catch (err) {
      console.error(err);
    }
};

// Export functions 
module.exports = {
    scanImages
};
