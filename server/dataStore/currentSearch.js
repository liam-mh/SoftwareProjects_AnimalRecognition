const fs = require('fs');
const path = require('path');

// currentSearch file location
const dataPath = path.join(__dirname, 'currentSearch.json');
const imagePath = path.join(__dirname, '../../client/public/userImages');

function saveToCurrentSearch(data) {
    try {
        if (!fs.existsSync(dataPath)) {
            fs.writeFileSync(dataPath, JSON.stringify(data), 'utf-8');
            console.log('File created: currentSearch.json');
        } else {
            fs.writeFileSync(dataPath, JSON.stringify(data), 'utf-8');
            console.log('Data saved to: currentSearch.json');
        }
    } catch (error) {
        console.error(error);
    }
};

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

function clearCurrentSearchData() {
    const emptyData = {};
    fs.writeFileSync(dataPath, JSON.stringify(emptyData));
};

function clearImageFolder() {
    const fileNames = fs.readdirSync(imagePath);
    fileNames.forEach((fileName) => {
        if (fileName !== ".gitkeep") {
            const filePath = path.join(imagePath, fileName);
            fs.unlinkSync(filePath);
        }
    });
};

function clearCurrentSearch() {
    clearCurrentSearchData();
    clearImageFolder();
    console.log('Current search data and images erased');
}

module.exports = { 
    saveToCurrentSearch,
    updateUserValidation,
    clearCurrentSearch
};