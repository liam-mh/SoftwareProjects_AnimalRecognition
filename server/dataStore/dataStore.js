/**
 * Formats and stores single searches in all search history.
 */

const fs = require('fs');
const path = require('path');

function saveToDataStore() {

    const sourceFile = './currentSearch.json';
    const destinationFile = './dataStore.json';

    // read the source file
    fs.readFile(sourceFile, 'utf8', (err, data) => {
        if (err) throw err;

        // parse the JSON data
        const jsonData = JSON.parse(data);

        // append the JSON data to the destination file
        fs.readFile(destinationFile, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // If the file doesn't exist, create an empty file with valid JSON data
                    fs.writeFile(destinationFile, '[]', (err) => {
                        if (err) throw err;
                        // Try reading the file again after creating it
                        saveToDataStore();
                    });
                } else {
                    throw err;
                }
            } else {
                // parse the existing JSON data in the destination file
                let existingData = [];
                if (data) {
                    try {
                        existingData = JSON.parse(data);
                    } catch (e) {
                        console.error('Invalid JSON data in destination file');
                        throw e;
                    }
                }

                // append the new data to the existing data
                const mergedData = existingData.concat(jsonData);

                // write the merged data to the destination file
                fs.writeFile(destinationFile, JSON.stringify(mergedData), (err) => {
                    if (err) throw err;
                    console.log('Data appended to', destinationFile);
                });
            }
        });
    });
}

/**
 * Moving images to dataStore
 */

function saveImages() {

    console.log('saveImages called');

    const sourceFolder = path.join(__dirname, '../../client/public/userImages');
    const destFolder = './images';
    
    // read the files in the source folder
    fs.readdir(sourceFolder, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
    
        // filter the .jpg files
        const imageFiles = files.filter(file => path.extname(file) === '.jpg');
    
        // move each image file to the destination folder
        imageFiles.forEach(file => {
            const sourcePath = path.join(sourceFolder, file);
            const destPath = path.join(destFolder, file);
    
            fs.rename(sourcePath, destPath, err => {
                if (err) {
                    console.error(`Failed to move ${sourcePath} to ${destPath}: ${err.message}`);
                } else {
                    console.log(`Moved ${sourcePath} to ${destPath}`);
                }
            });
        });
    });
}

module.exports = {
    saveToDataStore,
    saveImages,
  };
  