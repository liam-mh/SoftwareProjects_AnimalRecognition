// *** key.json must be placed inside '/visionAPI' folder to use ***

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
    
// Creates a client
const client = new vision.ImageAnnotatorClient({
    keyFilename: "visionAPI/key.json"
});    

// Path to users images
const path = require('path');
const userImagePath = path.join(__dirname, '../../client/public/userImages/');
const fs = require("fs");

// sub method
async function readDirectory(userImagePath, imageArr) {
    return new Promise((resolve, reject) => {
        fs.readdir(userImagePath, (err, files) => {
            if (err) reject(err);
            files.forEach(file => {
                imageArr.push({
                    path: file, 
                    labels: []
                });
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
        const [result] = await client.labelDetection(path.join(userImagePath, image.path));
        image.labels = result.labelAnnotations;
    };

    return labelData;
}

// Export function 
module.exports = getImageLabels;