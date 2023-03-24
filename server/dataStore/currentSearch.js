const fs = require('fs');
const path = require('path');

/**
 * Writing search data to a file
 */

function saveToCurrentSearch(data) {
    const filePath = path.join(__dirname, 'currentSearch.json');
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
            console.log('File created: currentSearch.json');
        } else {
            fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
            console.log('Data saved to: currentSearch.json');
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * Updating the data with the user validated labels
 */

function updateUserValidation(original, update) {
    for (let label of original[0].labels) {
        for (let i = 0; i < update.length; i++) {
            if (label.description === update[i]) {
                console.log('User thinks that "', label.description, '" being', label.validAgainstList, 'is incorrect');
                label.userThinksCorrect = false;
            }
        }
    }

};

module.exports = { 
    saveToCurrentSearch,
    updateUserValidation
};