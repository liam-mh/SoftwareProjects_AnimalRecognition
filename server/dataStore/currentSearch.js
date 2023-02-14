
const fs = require('fs');

function addData(userImages) {

    const dataArray = [];
    const currentDate = new Date();

    userImages.forEach(element => {
        const data = {
            date: currentDate,
            path: element.path,
            labels: element.labels.map(label => ({
                description: label.description,
                score: label.score
            }))
        };
        dataArray.push(data);
    });

    try {
        fs.writeFileSync('./dataStore/currentSearch.json', JSON.stringify(dataArray), 'utf-8');
        console.log('Current search data saved');
    } catch (error) {
        console.error(error);
    }
    
};

module.exports = addData;


/**
 fs.readFile('data.json', (err, data) => {
        if (err) throw err;
        let jsonData = JSON.parse(data);
        console.log(JSON.stringify(jsonData, null, 4));
    });
 */