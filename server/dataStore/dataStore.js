/**
 * Formats and stores single searches in all search history.
 */

const fs = require('fs');
const path = require('path');

function saveToDataStore() {

    const sourceFile = '/Users/liam/Documents/GitHub/SoftwareProjects_AnimalRecognition/server/dataStore/currentSearch.json';
    const destinationFile = '/Users/liam/Documents/GitHub/SoftwareProjects_AnimalRecognition/server/dataStore/dataStore.json';

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
function clearFolder() {
    const folderPath = '/Users/liam/Documents/GitHub/SoftwareProjects_AnimalRecognition/client/public/userImages';

    // Get an array of file names in the folder
    const fileNames = fs.readdirSync(folderPath);
  
    // Delete each file in the folder
    fileNames.forEach((fileName) => {
      const filePath = path.join(folderPath, fileName);
      fs.unlinkSync(filePath);
    });

    console.log('userImages cleared')
};

function saveImages() {

    const sourceFolder = '/Users/liam/Documents/GitHub/SoftwareProjects_AnimalRecognition/client/public/userImages';
    const destFolder = '/Users/liam/Documents/GitHub/SoftwareProjects_AnimalRecognition/server/dataStore/images';
    
    // read the files in the source folder
    fs.readdir(sourceFolder, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
    
        // move each file to the destination folder
        files.forEach(file => {
            const sourcePath = path.join(sourceFolder, file);
            const destPath = path.join(destFolder, file);
    
            fs.copyFile(sourcePath, destPath, err => {
                if (err) {
                    console.error(`Failed to copy ${file} to ${destPath}: ${err.message}`);
                } else {
                    console.log(`Copied ${file} to dataStore`);
                }
            });
        });
    });
}


function save() {
    saveImages();
    saveToDataStore();
};

/**
 * Read all data from the the datastore into an array
 */

function readJsonFileToArray(fileName) {
    try {
        const dataPath = path.join(__dirname, fileName);
        const jsonData = fs.readFileSync(dataPath, 'utf-8');
        const data = JSON.parse(jsonData);
        console.log('Data read from:', fileName);
        //console.log(data);
        return data;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    save,
    readJsonFileToArray,
    clearFolder
};





  