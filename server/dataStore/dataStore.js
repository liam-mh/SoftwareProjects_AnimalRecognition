/**
 * Formats and stores single searches in all search history.
 */

const fs = require('fs');
const path = require('path');

function saveToDataStore() {

    const sourceFile = path.join(__dirname + '/currentSearch.json');
    const destinationFile = path.join(__dirname + '/dataStore.json');

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
                    console.log('Data from: /currentSearch.json saved to: /dataStore.json');
                });
            }
        });
    });
}

/**
 * Moving images to dataStore
 */
function clearFolder() {
    const folderPath = path.join(__dirname, '../../client/public/userImages');

    // Get an array of file names in the folder
    const fileNames = fs.readdirSync(folderPath);
  
    // Delete each file in the folder, except for .gitkeep
    fileNames.forEach((fileName) => {
        if (fileName !== ".gitkeep") {
            const filePath = path.join(folderPath, fileName);
            fs.unlinkSync(filePath);
        }
    });

    console.log('userImages cleared')
};

function saveImages() {

    const sourceFolder = path.join(__dirname, '../../client/public/userImages');
    const destFolder = path.join(__dirname, 'images');
    
    // read the files in the source folder
    fs.readdir(sourceFolder, (err, files) => {
        
        if (err) {console.error(err); return;}
    
        // move each file to the destination folder
        files.forEach(file => {

            // skip the .gitkeep file
            if (file === '.gitkeep') {return;}

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
        if (data && data.length > 0) {
            console.log('Data read from:', fileName);
        } else {
            console.log('Data read from:', fileName, 'is empty');
        }
        return data;
    } catch (err) {
        console.error(err);
    }
}

function getMostCommonAnimal() {

    const data = readJsonFileToArray('dataStore.json');
    const animals = readJsonFileToArray('../visionAPI/animals.json');
    const animalFrequency = {};

    for (let image of data) {
        // Check if animal is in image
        const animalLabels = image.labels.filter(label => {
            return animals.includes(label.description);
        });

        // Count the frequency of each animal label
        for (let label of animalLabels) {
            if (animalFrequency[label.description]) {
                animalFrequency[label.description]++;
            } else {
                animalFrequency[label.description] = 1;
            }
        };
    }

    // Convert the animal frequency object into an array of objects with 'label' and 'frequency' properties
    const animalFrequencyArray = Object.entries(animalFrequency).map(([label, frequency]) => ({
        label,
        frequency
    }));

    // Sort the array by frequency in descending order
    animalFrequencyArray.sort((a, b) => b.frequency - a.frequency);

    return animalFrequencyArray;
};


module.exports = {
    save,
    readJsonFileToArray,
    clearFolder,
    getMostCommonAnimal
};





  