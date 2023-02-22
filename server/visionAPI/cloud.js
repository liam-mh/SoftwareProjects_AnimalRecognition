// *** key.json must be placed inside '/visionAPI' folder to use ***

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
    
// Creates a client
const client = new vision.ImageAnnotatorClient({
    keyFilename: "../../key.json"
});    

// Path to users images
const path = require('path');
const userImagePath = path.join(__dirname, '../../client/public/userImages/');
const fs = require("fs");

// sub method
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
}

// Return formatted array with labels
async function getImageLabels() {
    
    var labelData = [];
    await readDirectory(userImagePath, labelData);

    for (let image of labelData) {

        // Scan each image in public/userImages, add labels to array and bool
        const [result] = await client.labelDetection(path.join(userImagePath, image.path));
        const labels = result.labelAnnotations.map(label => ({ ...label, userThinksValid: true }));
        image.labels = labels;

        // check if animal is in image and update bool if not
        const animals = JSON.parse(fs.readFileSync(path.join(__dirname, 'animals.json'), 'utf8'));
        const animalLabels = labels.filter(label => {
            for (let animal of animals) {
                if (label.description === animal) {
                    return true;
                }
            }
            return false;
        });
        image.containsAnimal = animalLabels.length > 0;
        //console.log(image.containsAnimal);
    };
    
    return labelData;
}

// Export function 
module.exports = getImageLabels;