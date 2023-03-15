// Connecting to the firebase account
const admin = require("firebase-admin");
const path = require('path');
const key = path.join(__dirname, './firebaseKey.json');
admin.initializeApp({
    credential: admin.credential.cert(key),
    databaseURL: 'https://test-vision-376115-default-rtdb.europe-west1.firebasedatabase.app/',
    storageBucket: 'gs://test-vision-376115.appspot.com'
});

// Link to the database
const db = admin.database();


/**
 * Reading from the database
 */

function readAllFirebaseData() {
    const read = db.ref('labelData');
    return read.once('value')
    .then((snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            if (Array.isArray(childData)) {
                data.push(...childData);
            } else {
                data.push(childData);
            }
        });
        return data;
    })
    .catch((error) => {
        console.error(error);
    });
};
  

// read.once('value', (snapshot) => {
//     const data = snapshot.val();           // all table data
//     const keys = Object.keys(data);        // each row
//     const thirdKey = keys[2];              // row 3
//     const thirdName = data[thirdKey].name; // column in row
//     console.log('Name',thirdName);
// });
  
/**
 * Writing to the database
 */

const fs = require('fs');

function saveCurrentSearchToFirebase() {
    const currentSearch = JSON.parse(fs.readFileSync('server/dataStore/currentSearch.json', 'utf8'));
    const write = db.ref('labelData');
    write.push(currentSearch, (error) => {
        if (error) {
            console.log('Current search data could not be saved to Firebase:', error);
        } else {
            console.log('Current search data saved successfully to Firebase.');
        }
    });
};


/**
 * Saving images
 */

// Save image to Firebase Storage
async function saveImageToFirebaseStorage(fileName) {
    try {
        const sourcePath = path.join(__dirname, '../../client/public/userImages', fileName);
        console.log(sourcePath);
        const image = fs.readFileSync(sourcePath);

        const bucket = admin.storage().bucket();
        const storagePath = path.join('images/', fileName);
        const file = bucket.file(storagePath);
        await file.save(image, { public: true });

        console.log(`Image saved to Firebase Storage at ${storagePath}`);

        // Get public URL of saved file
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-15-2033'
        });
        console.log(url);
        return url; 
    } catch (error) {
        console.error(`Error saving image to Firebase Storage: ${error}`);
    }
};
  
module.exports = {
    saveImageToFirebaseStorage,
    saveCurrentSearchToFirebase,
    readAllFirebaseData
};