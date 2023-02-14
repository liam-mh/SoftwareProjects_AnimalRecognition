/**
 * Receiving, formatting and saving the users current images with the search data
 */

const fs = require('fs');

function writeToFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
        console.log('Data saved to: ', filePath);
    } catch (error) {
        console.error(error);
    }
}

function addData(userImages) {

    const dataArray = [];
    const currentDate = new Date();

    userImages.forEach(element => {
        const data = {
            date: currentDate,
            path: element.path,
            labels: element.labels.map(label => ({
                valid: true,
                description: label.description,
                score: label.score
            }))
        };
        console.log(data);
        dataArray.push(data);
    });

    writeToFile('./dataStore/currentSearch.json', dataArray);
};

module.exports = addData;

/**
 * Updating the data with the user validated labels
 * Using dummy data until passed from front-end
 */

function readFromFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) reject(err);
            try {
                const jsonData = JSON.parse(data || "{}");
                resolve(jsonData);
            } catch (err) {
                reject(err);
            }
        });
    });
}
  
firstSearchData = readFromFile('dataStore/currentSearch.json').then((jsonData) => {
    console.log(JSON.stringify(jsonData, null, 4));
}).catch((err) => {
    console.error(err);
});


  