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

dummyData = 
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

function updateUserValidation(original, update) {

    for (let i = 0; i < original.length; i++) {

        var o = original[i];
        var u = update[i];
        if (o.path != u.path) {continue;}

        for (let j = 0; j < original[i].labels.length; j++) {

            o = o.labels[j];
            u = u.labels[j];

            if (!o || !u) {
                continue;
            } 
            if (o.description === u.description) {
                o.userThinksValid = u.userThinksValid;
            }
            console.log('o: ', o.userThinksValid, ' u: ', u.userThinksValid); 
        }
    }
};


updateUserValidation(dataFromFile, dummyData);





  