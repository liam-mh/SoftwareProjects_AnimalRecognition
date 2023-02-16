/**
 * Receiving, formatting and saving the users current images with the search data
 */

const fs = require('fs');

function writeToFile(fileName, data) {
    try {
        fs.writeFileSync('./dataStore/'+fileName, JSON.stringify(data), 'utf-8');
        console.log('Data saved to:', fileName);
    } catch (error) {
        console.error(error);
    }
}

module.exports = writeToFile;

/**
 * Updating the data with the user validated labels
 * Using dummy data until passed from front-end
 */

function readJsonFileToArray(fileName) {
    try {
        const jsonData = fs.readFileSync('./'+fileName, 'utf-8');
        const data = JSON.parse(jsonData);
        return data;
    } catch (err) {
        console.error(err);
    }
};

const dataFromFile = readJsonFileToArray('currentSearch.json');

var dummyData = 
[
    {
        "path":"cat_dog.jpg",
        "labels":[
            {
                "description":"Dog",
                "userThinksValid":false
            }
        ],
    }
]

dummyData = readJsonFileToArray('currentSearch.json');

function updateUserValidation(original, update) {

    for (let i = 0; i < original.length; i++) {

        if (original[i].path != update[i].path) {continue;}

        for (let j = 0; j < original[i].labels.length; j++) {

            if (!original[i].labels[j] || !update[i].labels[j]) {
                continue;
            } 
            if (original[i].labels[j].description === update[i].labels[j].description) {
                if (original[i].labels[j].userThinksValid != update[i].labels[j].userThinksValid) {
                    original[i].labels[j].userThinksValid = update[i].labels[j].userThinksValid;
                    console.log("User invalidated label: ", original[i].labels[j].description )
                }
            }
        }
    }
};

updateUserValidation(dataFromFile, dummyData);

const ds = require('./dataStore.js');
ds.saveToDataStore();

ds.saveImages();
