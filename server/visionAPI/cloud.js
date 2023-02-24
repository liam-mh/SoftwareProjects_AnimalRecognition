// *** key.json must be placed inside '/visionAPI' folder to use ***

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

// Export functions 
module.exports = {
    getImageLabels,
    checkLabelsForAnimal,
};