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

function readFirebaseData(reference) {
    const read = db.ref(reference);
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
    write.child(currentSearch[0].path.substring(0, 13)).set(currentSearch, (error) => {
        if (error) {
            console.log('Current search data could not be saved to Firebase:', error);
        } else {
            console.log('Current search data saved successfully to Firebase.');
        }
    });
};

function saveErrorToFirebase(error) {
    const write = db.ref('errorLogs');
    write.push(error, (error) => {
        if (error) {
            console.log('Error data could not be saved to Firebase:', error);
        } else {
            console.log('Error data saved successfully to Firebase.');
        }
    });
};
  
const saveImageToFirebaseStorage = async (fileName) => {
    try {
        const bucket = admin.storage().bucket();
        const [file] = await bucket.upload(
            path.join(__dirname, "../../client/public/userImages", fileName),
            { destination: `${fileName}`, public: true }
        );
        const [metadata] = await file.getMetadata();
        const url = metadata.mediaLink;

        console.log(`Image saved to Firebase Storage:`, fileName);
        return url;
    } catch (error) {
        console.error(`Error uploading file to Firebase Storage: ${error}`);
        throw error;
    }
};
  
module.exports = {
    saveImageToFirebaseStorage,
    saveCurrentSearchToFirebase,
    saveErrorToFirebase,
    readFirebaseData,
};