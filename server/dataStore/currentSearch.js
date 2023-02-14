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

  





  